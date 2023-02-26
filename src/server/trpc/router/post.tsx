import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import NewPostEmail from '../../../../react-email/emails/new-post'
import { protectedProcedure, router } from '../trpc'
import { PostRouterInputs } from '@/utils/trpc-inputs'
import { canUserManageProject } from '@/server/server-utils'
import { publishSubscriptionMessage } from '@/utils/ably-types'
import { EmailMessage, EmailService } from '@/server/email-service'

const verifyPostExists = async (postId: string, prisma: PrismaClient) => {
  const post = await prisma.projectPost.findUnique({
    where: { id: postId },
    include: { project: true },
  })
  if (!post) {
    throw new TRPCError({ code: 'NOT_FOUND' })
  }
  return post
}

export const postRouter = router({
  create: protectedProcedure
    .input(PostRouterInputs.create)
    .mutation(async ({ input, ctx: { user, prisma } }) => {
      const project = await prisma.project.findUnique({
        where: { id: input.projectId },
        include: { game: true },
      })
      if (!project) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      if (!canUserManageProject(project, user)) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

      const created = await prisma.projectPost.create({
        data: {
          authorId: user.id,
          projectId: input.projectId,
          title: input.post.title,
          abstract: input.post.abstract,
          body: input.post.body,
        },
      })

      const subscriptions = await prisma.subscription.findMany({
        where: {
          projectId: input.projectId,
          type: { has: 'EMAIL' },
          user: { emailVerified: true, email: { not: null } },
        },
        include: { user: true },
      })

      const emails: EmailMessage[] = subscriptions.flatMap((subscription) => {
        const email = () => (
          <NewPostEmail
            projectId={project.id}
            projectName={project.name}
            projectLogoUrl={project.logoUrl ?? undefined}
            postTitle={created.title}
            postAbstract={created.abstract}
            postLink={`/${project.game.key}/${project.key}/posts/${created.id}`}
            recipientUserId={subscription.user.id}
          />
        )
        return [
          {
            email,
            recipient: subscription.user,
            subject: `New post for ${project.name}`,
          },
        ]
      })
      await Promise.all([
        EmailService.sendEmails(emails),
        publishSubscriptionMessage({
          type: 'newProjectPost',
          game: {
            id: project.game.id,
            key: project.game.key,
            name: project.game.name,
          },
          project: {
            id: project.id,
            key: project.key,
            name: project.name,
          },
          post: {
            id: created.id,
            title: created.title,
            authorName: user.name ?? 'Anonymous',
          },
        }),
      ])

      return created
    }),
  edit: protectedProcedure
    .input(PostRouterInputs.edit)
    .mutation(async ({ input, ctx: { user, prisma } }) => {
      const post = await verifyPostExists(input.postId, prisma)

      if (
        user.id !== post.authorId ||
        !canUserManageProject(post.project, user)
      ) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

      return await prisma.projectPost.update({
        where: { id: input.postId },
        data: {
          title: input.post.title,
          abstract: input.post.abstract,
          body: input.post.body,
        },
      })
    }),
  delete: protectedProcedure
    .input(
      z.object({
        postId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx: { user, prisma } }) => {
      const post = await verifyPostExists(input.postId, prisma)

      if (
        user.id !== post.authorId ||
        !canUserManageProject(post.project, user)
      ) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

      return prisma.projectPost.delete({ where: { id: input.postId } })
    }),
})

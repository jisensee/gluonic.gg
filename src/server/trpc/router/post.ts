import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { protectedProcedure, router } from '../trpc'
import { PostRouterInputs } from '@/utils/trpc-inputs'
import { canUserManageProject } from '@/server/server-utils'

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
      })
      if (!project) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      if (!canUserManageProject(project, user)) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

      return await prisma.projectPost.create({
        data: {
          authorId: user.id,
          projectId: input.projectId,
          title: input.post.title,
          abstract: input.post.abstract,
          body: input.post.body,
        },
      })
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

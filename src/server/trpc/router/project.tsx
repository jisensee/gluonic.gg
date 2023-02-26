import { isAddress } from '@ethersproject/address'
import { TRPCError } from '@trpc/server'
import { adminProcedure, protectedProcedure, router } from '../trpc'
import NewProjectEmail from '../../../../react-email/emails/new-project'
import NewProjectRequestEmail from '../../../../react-email/emails/new-project-request'
import ProjectRequestProcessedEmail from '../../../../react-email/emails/project-request-processed'
import { canUserManageProject } from '@/server/server-utils'
import { ProjectRouterInputs } from '@/utils/trpc-inputs'
import { EmailMessage, EmailService } from '@/server/email-service'
import { publishSubscriptionMessage } from '@/utils/ably-types'

export const projectRouter = router({
  update: protectedProcedure
    .input(ProjectRouterInputs.update)
    .mutation(async ({ input, ctx: { prisma, user } }) => {
      const project = await prisma.project.findUnique({
        where: { id: input.projectId },
        include: {
          projectAuthorships: { include: { user: true } },
          game: true,
        },
      })

      if (!project) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      if (!canUserManageProject(project, user)) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }
      if (input.donationAddress && !isAddress(input.donationAddress)) {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }

      const isInitialPublish =
        !project.published && !project.initialPublishDone && input.published

      await prisma.project.update({
        where: { id: input.projectId },
        data: {
          abstract: input.abstract,
          description: input.description,
          website: input.website,
          published: input.published,
          initialPublishDone: isInitialPublish,
          donationAddress: input.donationAddress,
          lastUpdate: new Date(),
        },
      })
      if (input.socials) {
        await prisma.project.update({
          where: { id: input.projectId },
          data: {
            lastUpdate: new Date(),
            socials: {
              update: {
                twitter: input.socials.twitter,
                discord: input.socials.discord,
                github: input.socials.github,
              },
            },
          },
        })
      }
      if (isInitialPublish) {
        // Send email to game subscribers
        const subscriptions = await prisma.subscription.findMany({
          where: {
            gameId: project.gameId,
            user: { email: { not: null }, emailVerified: true },
          },
          include: { user: true },
        })
        const emails: EmailMessage[] = subscriptions.flatMap((sub) => {
          return [
            {
              email: () => (
                <NewProjectEmail
                  authorNames={project.projectAuthorships.flatMap((as) =>
                    as.user.name ? [as.user.name] : []
                  )}
                  gameName={project.game.name}
                  gameId={project.gameId}
                  projectName={project.name}
                  projectAbstract={project.abstract}
                  gameLogoUrl={project.game.logoUrl}
                  recipientUserId={sub.userId}
                  projectLogoUrl={project.logoUrl ?? undefined}
                  projectLink={`/${project.game.key}/${project.key}`}
                />
              ),
              recipient: sub.user,
              subject: `New project for ${project.game.name}`,
            },
          ]
        })
        await Promise.all([
          EmailService.sendEmails(emails),
          publishSubscriptionMessage({
            type: 'newGameProject',
            project: {
              id: project.id,
              key: project.key,
              name: project.name,
            },
            game: {
              id: project.game.id,
              key: project.game.key,
              name: project.game.name,
            },
          }),
        ])
      }
    }),
  request: protectedProcedure
    .input(ProjectRouterInputs.request)
    .mutation(async ({ input, ctx: { prisma, user } }) => {
      const game = await prisma.game.findUnique({ where: { id: input.gameId } })

      if (!game) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      const requests = await prisma.projectRequest.count({
        where: { rejected: false },
      })

      if (requests > 30) {
        console.warn('Too many pending project requests, blocking new ones')
        throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })
      }

      await prisma.projectRequest.create({
        data: {
          projectName: input.name,
          projectAbstract: input.abstract,
          projectWebsite: input.website,
          userId: user.id,
          gameId: game.id,
        },
      })

      const admins = await prisma.user.findMany({
        where: {
          role: 'ADMIN',
        },
      })
      const emails: EmailMessage[] = admins.map((user) => ({
        email: () => (
          <NewProjectRequestEmail
            key={user.id}
            projectName={input.name}
            projectAbstract={input.abstract}
            gameName={game.name}
            gameLogoUrl={game.logoUrl}
            author={user.name ?? undefined}
            recipientUserId={user.id}
          />
        ),
        subject: `New project request for ${game.name}`,
        recipient: user,
      }))
      await EmailService.sendEmails(emails)
    }),
  processRequest: adminProcedure
    .input(ProjectRouterInputs.processRequest)
    .mutation(async ({ input, ctx: { prisma } }) => {
      const request = await prisma.projectRequest.findUnique({
        where: { id: input.requestId },
        include: { game: true, user: true },
      })
      if (!request) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      if (input.isAccepted && input.projectKey) {
        await prisma.$transaction([
          prisma.project.create({
            data: {
              key: input.projectKey,
              name: request.projectName,
              abstract: request.projectAbstract,
              website: request.projectWebsite,
              game: { connect: { id: request.game.id } },
              initialPublishDone: false,
              projectAuthorships: {
                create: { type: 'ADMIN', userId: request.userId },
              },
              socials: { create: {} },
            },
          }),
          prisma.projectRequest.delete({ where: { id: request.id } }),
        ])
      } else if (!input.isAccepted) {
        await prisma.projectRequest.update({
          where: { id: request.id },
          data: {
            rejected: true,
          },
        })
      } else {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }

      await EmailService.sendEmails([
        {
          email: () => (
            <ProjectRequestProcessedEmail
              projectName={request.projectName}
              authorName={request.user.name ?? undefined}
              recipientUserId={request.user.id}
              manageProjectLink={`/${request.game.key}/${input.projectKey}/manage`}
              approved={input.isAccepted}
            />
          ),
          recipient: request.user,
          subject: `Your project request for ${request.game.name} has been ${
            input.isAccepted ? 'approved' : 'rejected'
          }`,
        },
      ])
    }),
  toggleFavorite: protectedProcedure
    .input(ProjectRouterInputs.toggleFavorite)
    .mutation(async ({ input: { projectId }, ctx: { prisma, user } }) => {
      const favoritedProjects = await prisma.user
        .findUnique({
          where: { id: user.id },
          include: { favoritedProjects: true },
        })
        .then((u) => u?.favoritedProjects)
      const project = await prisma.project.findUnique({
        where: { id: projectId },
      })
      if (!favoritedProjects || !project) {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }
      if (favoritedProjects.find((p) => p.id === projectId)) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            favoritedProjects: {
              disconnect: { id: projectId },
            },
          },
        })
        return false
      } else {
        await prisma.user.update({
          where: { id: user.id },
          data: { favoritedProjects: { connect: { id: project.id } } },
        })
        return true
      }
    }),
})

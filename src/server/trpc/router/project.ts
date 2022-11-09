import { isAddress } from '@ethersproject/address'
import { TRPCError } from '@trpc/server'
import { adminProcedure, protectedProcedure, router } from '../trpc'
import { canUserManageProject } from '@/server/server-utils'
import { ProjectRouterInputs } from '@/utils/trpc-inputs'

export const projectRouter = router({
  update: protectedProcedure
    .input(ProjectRouterInputs.update)
    .mutation(async ({ input, ctx: { prisma, user } }) => {
      const project = await prisma.project.findUnique({
        where: { id: input.projectId },
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

      await prisma.project.update({
        where: { id: input.projectId },
        data: {
          abstract: input.abstract,
          description: input.description,
          website: input.website,
          published: input.published,
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
    }),
  request: protectedProcedure
    .input(ProjectRouterInputs.request)
    .mutation(async ({ input, ctx: { prisma, user } }) => {
      const game = await prisma.game.findUnique({ where: { id: input.gameId } })

      if (!game) {
        throw new TRPCError({ code: 'NOT_FOUND' })
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
    }),
  processRequest: adminProcedure
    .input(ProjectRouterInputs.processRequest)
    .mutation(async ({ input, ctx: { prisma } }) => {
      const request = await prisma.projectRequest.findUnique({
        where: { id: input.requestId },
        include: { game: true },
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

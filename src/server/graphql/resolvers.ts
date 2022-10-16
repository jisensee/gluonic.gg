import { ForbiddenError, UserInputError } from 'apollo-server-micro'
import { User } from '@prisma/client'
import { Maybe } from 'purify-ts'
import { isAddress } from 'ethers/lib/utils'
import { UserService } from '../user-service'
import { canUserManageProject, requireUserGql } from '../server-utils'
import { Resolvers } from '@/generated/graphql-resolver-types'
import { db } from '@/server/db'
import {
  OwnUserUpdateInputSchema,
  ProjectBaseDataInputSchema,
  ProjectDonationInputSchema,
  ProjectRequestInputSchema,
  ProjectSocialsInputSchema,
} from '@/generated/graphql-yup-schema'

export type Context = {
  user: Maybe<User>
}

export const resolvers: Resolvers = {
  Query: {
    currentUser: (_, _args, { user }) => user.extractNullable(),
  },
  Mutation: {
    updateOwnUser: (_, { data }, context) =>
      requireUserGql(context, async (user) => {
        OwnUserUpdateInputSchema().validateSync(data)

        return db.user.update({
          where: { id: user.id },
          data: {
            name: data.name,
            bio: data.bio,
            socials: {
              update: {
                discord: data.socials.discord,
                twitter: data.socials.twitter,
                github: data.socials.github,
                website: data.socials.website,
              },
            },
          },
        })
      }),
    updateProject: (_, { projectId, data }, context) =>
      requireUserGql(context, async (user) => {
        if (data.baseData) {
          ProjectBaseDataInputSchema().validateSync(data.baseData)
        }
        if (data.socials) {
          ProjectSocialsInputSchema().validateSync(data.socials)
        }
        if (data.donationData) {
          ProjectDonationInputSchema().validateSync(data.donationData)
        }

        const project = await db.project.findUnique({
          where: { id: projectId },
        })
        if (!project) {
          throw UserInputError
        }
        if (!canUserManageProject(project, user)) {
          throw ForbiddenError
        }
        if (data.baseData) {
          await db.project.update({
            where: { id: projectId },
            data: {
              abstract: data.baseData.abstract,
              description: data.baseData.description,
              website: data.baseData.website,
              published: data.baseData.published,
              lastUpdate: new Date(),
            },
          })
        }
        if (data.socials) {
          await db.project.update({
            where: { id: projectId },
            data: {
              lastUpdate: new Date(),
              socials: {
                update: {
                  twitter: data.socials.twitter,
                  discord: data.socials.discord,
                  github: data.socials.github,
                },
              },
            },
          })
        }
        if (data.donationData) {
          if (
            data.donationData.donationAddress &&
            !isAddress(data.donationData.donationAddress)
          ) {
            throw UserInputError
          }
          await db.project.update({
            where: { id: projectId },
            data: {
              donationAddress: data.donationData.donationAddress,
              lastUpdate: new Date(),
            },
          })
        }
        return true
      }),
    requestProject: (_, { data }, context) =>
      requireUserGql(context, async (user) => {
        ProjectRequestInputSchema().validateSync(data)
        const game = await db.game.findUnique({ where: { id: data.gameId } })
        if (!game) {
          throw UserInputError
        }

        await db.projectRequest.create({
          data: {
            projectName: data.name,
            projectAbstract: data.abstract,
            projectWebsite: data.website,
            userId: user.id,
            gameId: game.id,
          },
        })
        return true
      }),
    processProjectRequest: (
      _,
      { requestId, isAccepted, projectKey },
      context
    ) =>
      requireUserGql(context, async (user) => {
        if (user.role !== 'ADMIN') {
          throw ForbiddenError
        }

        const request = await db.projectRequest.findUnique({
          where: { id: requestId },
          include: { game: true },
        })
        if (!request) {
          throw UserInputError
        }

        if (isAccepted && projectKey) {
          await db.$transaction([
            db.project.create({
              data: {
                key: projectKey,
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
            db.projectRequest.delete({ where: { id: request.id } }),
          ])
        } else if (!isAccepted) {
          await db.projectRequest.update({
            where: { id: request.id },
            data: {
              rejected: true,
            },
          })
        } else {
          throw UserInputError
        }
        return true
      }),
    toggleFavoriteProject: (_, { projectId }, context) =>
      requireUserGql(context, async (user) => {
        const favoritedProjects = await db.user
          .findUnique({
            where: { id: user.id },
            include: { favoritedProjects: true },
          })
          .then((u) => u?.favoritedProjects)
        const project = await db.project.findUnique({
          where: { id: projectId },
        })
        if (!favoritedProjects || !project) {
          throw UserInputError
        }
        if (favoritedProjects.find((p) => p.id === projectId)) {
          await db.user.update({
            where: { id: user.id },
            data: {
              favoritedProjects: {
                disconnect: { id: projectId },
              },
            },
          })
          return false
        } else {
          await db.user.update({
            where: { id: user.id },
            data: { favoritedProjects: { connect: { id: project.id } } },
          })
          return true
        }
      }),
  },
  User: {
    id: (user) => user.id,
    name: (user) => user.name ?? user.address,
    bio: (user) => user.bio,
    hasDefaultName: (user) => user.name === null,
    isAdmin: (user) => user.role === 'ADMIN',
    isProjectAuthor: async (user) =>
      (await db.projectAuthorships.count({ where: { user } })) > 0,
    address: (user, _, { user: requestingUser }) =>
      requestingUser
        .filter((ru) => ru.id === user.id)
        .map((u) => u.address)
        .extractNullable(),
    socials: (user) =>
      UserService.findSocials(user).orDefault({
        id: '',
        discord: null,
        website: null,
        github: null,
        twitter: null,
      }),
  },
  Socials: {
    website: (s) => s.website,
    twitter: (s) => s.twitter,
    discord: (s) => s.discord,
    github: (s) => s.github,
  },
}

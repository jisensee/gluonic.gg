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
  },
  User: {
    id: (user) => user.id,
    name: (user) => user.name ?? user.address,
    bio: (user) => user.bio,
    hasDefaultName: (user) => user.name === null,
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

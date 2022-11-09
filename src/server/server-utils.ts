import { ParsedUrlQuery } from 'querystring'
import { Project, User, UserRole } from '@prisma/client'
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiRequest,
  PreviewData,
} from 'next'
import { Maybe, MaybeAsync } from 'purify-ts'
import { AuthService } from './auth-service'
import { prisma } from '@/server/db/client'

export const withUser = <T>(
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
  withUser: (user: User) => Promise<GetServerSidePropsResult<T>>
) =>
  AuthService.findUserFromRequest(context.req as NextApiRequest)
    .chain((user) => MaybeAsync(() => withUser(user)))
    .orDefault({ redirect: { destination: '/', permanent: false } })

export const withOptionalUser = <T>(
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
  withUser: (user: Maybe<User>) => Promise<GetServerSidePropsResult<T>>
) =>
  AuthService.findUserFromRequest(context.req as NextApiRequest)
    .run()
    .then(withUser)

export const canUserManageProject = async (project: Project, user: User) =>
  user.role === UserRole.ADMIN ||
  prisma.projectAuthorships
    .count({
      where: {
        projectId: project.id,
        userId: user.id,
      },
    })
    .then((count) => count > 0)

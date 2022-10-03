import { ParsedUrlQuery } from 'querystring'
import { ForbiddenError } from 'apollo-server-micro'
import { Project, User, UserRole } from '@prisma/client'
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiRequest,
  PreviewData,
} from 'next'
import { Maybe, MaybeAsync } from 'purify-ts'
import { AuthService } from './auth-service'
import { Context } from './graphql/resolvers'
import { db } from '@/server/db'

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
  db.projectAuthorships
    .count({
      where: {
        projectId: project.id,
        userId: user.id,
      },
    })
    .then((count) => count > 0)

export const requireUserGql = <T>(
  context: Context,
  withValidUser: (user: User) => Promise<T>
) => {
  const user = context.user.extract()
  if (user == null) {
    throw ForbiddenError
  }
  return withValidUser(user)
}

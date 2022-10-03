import { readFileSync } from 'fs'
import { join } from 'path'
import { ApolloServer } from 'apollo-server-micro'
import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import { Context, resolvers } from '@/server/graphql/resolvers'
import { maybePromise } from '@/fp-utils'
import { UserService } from '@/server/user-service'

const typeDefs = readFileSync(join(process.cwd(), 'schema.graphql'), 'utf-8')

type ContextArg = {
  req: NextApiRequest
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }: ContextArg) => {
    const user = await maybePromise(getToken({ req }))
      .map((jwt) => jwt.email ?? '')
      .chain(UserService.findById)
      .run()

    return { user } as Context
  },
})
const startServer = server.start()

export default async function GraphqlApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await startServer
  return server.createHandler({ path: '/api/graphql' })(req, res)
}

export const config = {
  api: {
    bodyParser: false,
  },
}

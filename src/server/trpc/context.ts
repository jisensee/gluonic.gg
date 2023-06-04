import { type inferAsyncReturnType } from '@trpc/server'
import { getToken } from 'next-auth/jwt'

import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { NextRequest } from 'next/server'
import { prisma } from '../db/client'

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: FetchCreateContextFnOptions) => {
  const { req } = opts

  const token = await getToken({ req: req as NextRequest })
  const userId = token?.email
  const user = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        include: { socials: true },
      })
    : null

  return {
    user,
    prisma,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>

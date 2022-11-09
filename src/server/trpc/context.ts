import { type inferAsyncReturnType } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { getToken } from 'next-auth/jwt'

import { prisma } from '../db/client'

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req } = opts

  const token = await getToken({ req })
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

import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'

import { type Context } from './context'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape
  },
})

export const router = t.router

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  })
})

/**
 * Procedure that ensures user is logged in
 **/
export const protectedProcedure = t.procedure.use(isAuthed)

/**
 * Procedure that ensures the user is an admin
 **/
export const adminProcedure = protectedProcedure.use(
  t.middleware(({ ctx, next }) => {
    if (ctx.user?.role != 'ADMIN') {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
    return next({ ctx })
  })
)

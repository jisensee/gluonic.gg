import { SubscriptionType } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

export const subscriptionRouter = router({
  withPushNotification: protectedProcedure.query(
    async ({ ctx: { user, prisma } }) => {
      return await prisma.subscription.findMany({
        where: {
          userId: user.id,
          type: {
            has: SubscriptionType.PUSH_NOTIFICATION,
          },
        },
      })
    }
  ),
  ofUser: protectedProcedure.query(async ({ ctx: { user, prisma } }) => {
    return prisma.subscription.findMany({
      where: { userId: user.id },
      include: { project: { include: { game: true } }, game: true },
    })
  }),
  delete: protectedProcedure
    .input(z.object({ subscriptionId: z.string() }))
    .mutation(async ({ ctx: { user, prisma }, input }) => {
      await prisma.subscription.deleteMany({
        where: { id: input.subscriptionId, userId: user.id },
      })
    }),
  upsert: protectedProcedure
    .input(
      z.object({
        projectId: z.string().nullish(),
        gameId: z.string().nullish(),
        type: z.array(
          z.enum([SubscriptionType.PUSH_NOTIFICATION, SubscriptionType.EMAIL])
        ),
      })
    )
    .mutation(
      async ({ ctx: { user, prisma }, input: { projectId, gameId, type } }) => {
        if (type.length === 0) {
          throw new TRPCError({ code: 'BAD_REQUEST' })
        }

        const existing = await prisma.subscription.findFirst({
          where: { userId: user.id, projectId, gameId },
        })
        if (existing) {
          await prisma.subscription.update({
            where: { id: existing.id },
            data: { type },
          })
        } else {
          await prisma.subscription.create({
            data: {
              userId: user.id,
              projectId,
              gameId,
              type,
            },
          })
        }
      }
    ),
})

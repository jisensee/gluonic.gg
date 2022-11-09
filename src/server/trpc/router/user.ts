import { router, publicProcedure, protectedProcedure } from '../trpc'
import { UserRouterInputs } from '@/utils/trpc-inputs'

export const userRouter = router({
  current: publicProcedure.query(({ ctx }) => ctx.user),

  updateOwn: protectedProcedure
    .input(UserRouterInputs.updateOwn)
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: { id: ctx.user.id },
        include: { socials: true },
        data: {
          name: input.name,
          bio: input.bio,
          socials: {
            update: {
              discord: input.socials.discord,
              twitter: input.socials.twitter,
              github: input.socials.github,
              website: input.socials.website,
            },
          },
        },
      })
    }),
})

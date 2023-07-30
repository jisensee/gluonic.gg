import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { UserRouterInputs } from '@/utils/trpc-inputs'
import { EmailService } from '@/server/email-service'

export const userRouter = router({
  current: publicProcedure.query(({ ctx }) => ctx.user),

  verifyEmail: protectedProcedure
    .input(z.object({ code: z.string() }))
    .mutation(({ input, ctx }) =>
      EmailService.verifyEmail(ctx.user.id, input.code)
    ),

  resendVerificationEmail: protectedProcedure.mutation(({ ctx: { user } }) => {
    if (!user.email || user.emailVerified) {
      throw new TRPCError({ code: 'BAD_REQUEST' })
    }
    EmailService.startEmailVerification(user, user.email)
  }),

  updateOwn: protectedProcedure
    .input(UserRouterInputs.updateOwn)
    .mutation(async ({ input, ctx: { user, prisma } }) => {
      const verificationCode = await EmailService.handleEmailChange(
        user,
        input.email
      )

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        include: { socials: true },
        data: {
          name: input.name,
          bio: input.bio,
          email: input.email,
          receiveEmails: input.receiveEmails,
          emailVerified:
            verificationCode || !input.email ? false : user.emailVerified,
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

      return {
        updatedUser,
        emailVerificationStarted: verificationCode !== undefined,
      }
    }),

  deleteOwn: protectedProcedure.mutation(({ ctx: { user, prisma } }) =>
    prisma.user.delete({ where: { id: user.id } })
  ),
})

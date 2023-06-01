import { addDays, isBefore } from 'date-fns'
import { ReactElement } from 'react'
import { ServerClient } from 'postmark'
import { render } from '@react-email/render'
import { User } from '@prisma/client'
import VerifyEmail from '../../react-email/emails/verify-email'
import { getLogger } from './logger'
import { prisma } from '@/server/db/client'
import { env } from '@/env.mjs'

const logger = getLogger('EmailService')

const canUserReceiveEmails = (user: User | string) =>
  typeof user === 'string'
    ? true
    : user.email && user.emailVerified && user.receiveEmails

export type EmailMessage = {
  email: () => ReactElement
  recipient: User | string
  subject: string
}
const sendEmails = async (emails: EmailMessage[]) => {
  const client = new ServerClient(env.POSTMARK_API_KEY)

  const start = Date.now()

  await client.sendEmailBatch(
    emails
      .filter(({ recipient }) => canUserReceiveEmails(recipient))
      .flatMap(({ email, recipient, subject }) => {
        const address =
          typeof recipient === 'string' ? recipient : recipient.email
        if (!address) {
          return []
        }
        return [
          {
            From: 'notifications@gluonic.gg',
            To: address,
            Subject: subject,
            HtmlBody: render(email()),
          },
        ]
      })
  )
  const time = Date.now() - start
  logger.info(`Sent ${emails.length} is ${time}ms`)
}

const startEmailVerification = async (user: User, email: string) => {
  // Delete existing codes before creating a new one
  await prisma.emailVerificationCode.deleteMany({
    where: { userId: user.id },
  })

  const code = await prisma.emailVerificationCode.create({
    data: {
      userId: user.id,
      validUntil: addDays(new Date(), 7),
    },
  })

  await sendEmails([
    {
      email: () => (
        <VerifyEmail
          code={code.id}
          username={user.name ?? 'anon'}
          recipientUserId={user.id}
        />
      ),
      recipient: email,
      subject: 'Verify your email',
    },
  ])

  return code
}

type VerifyEmailResult = 'success' | 'invalid-code' | 'code-expired'

const verifyEmail = async (
  userId: string,
  code: string
): Promise<VerifyEmailResult> => {
  const existing = await prisma.emailVerificationCode.findFirst({
    where: { id: code, userId },
  })

  if (!existing) {
    return 'invalid-code'
  }
  if (isBefore(existing.validUntil, new Date())) {
    return 'code-expired'
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      emailVerified: true,
      receiveEmails: true,
    },
  })
  await prisma.emailVerificationCode.delete({ where: { id: code } })
  return 'success'
}

const handleEmailChange = async (
  user: User,
  newEmail: string | null | undefined
) => {
  // Do nothing if nothing changed
  if (user.email === newEmail) {
    return
  }
  // Always invalidate a potentially existing code
  await prisma.emailVerificationCode.deleteMany({ where: { userId: user.id } })

  // If new email entered, start new verification process for that email
  if (newEmail && newEmail !== '') {
    return startEmailVerification(user, newEmail)
  }
}

export const EmailService = {
  verifyEmail,
  startEmailVerification,
  handleEmailChange,
  sendEmails,
}

import * as React from 'react'
import { buildUrl, Button } from './components/common'
import { Text, Section, BaseEmail, Column, EmailProps } from './components/base'

export type VerifyEmailProps = {
  code: string
  username: string
} & EmailProps

export default function VerifyEmail({
  code,
  username,
  recipientUserId,
}: VerifyEmailProps) {
  const url = buildUrl(`/verify-email/${code}`)

  return (
    <BaseEmail
      title='Verify your email for Gluonic'
      recipientUserId={recipientUserId}
    >
      <Section>
        <Column>
          <Text>
            Hello {username}, <br />
            Click this link to verify your email address on Gluonic.
          </Text>
          <Text>
            You will be able to receive email notifications once you verified
            this email address.
          </Text>
        </Column>
      </Section>
      <Section className='text-center'>
        <Button className='w-1/2' href={url}>
          Verify Email
        </Button>
      </Section>
    </BaseEmail>
  )
}

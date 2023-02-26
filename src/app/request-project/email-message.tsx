'use client'

import { Alert } from 'react-daisyui'
import { FC } from 'react'
import { faInfo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from '@/components/link'

type EmailMessageProps = {
  canReceiveEmail: boolean
  userId: string
}

export const EmailMessage: FC<EmailMessageProps> = ({
  canReceiveEmail,
  userId,
}) => (
  <>
    {canReceiveEmail && (
      <p>
        You will receive an email notification when your request has been
        processed.
      </p>
    )}
    {!canReceiveEmail && (
      <Alert status='info' icon={<FontAwesomeIcon icon={faInfo} />}>
        <span>
          If you would like to receive an email notification when your request
          has been processed,{' '}
          <Link className='font-bold underline' href={`/users/${userId}/edit`}>
            add an email address to your profile.
          </Link>
        </span>
      </Alert>
    )}
  </>
)

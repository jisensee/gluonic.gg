'use client'

import { Button } from 'react-daisyui'
import { Metadata } from 'next/types'
import { PageTitle } from '@/components/common/page-title'
import { trpc } from '@/utils/trpc'
import { mutationToToastStatus, useStatusToast } from '@/context/toast-context'

export const metadata: Metadata = {
  title: 'Verify email',
}

export const ExpiredCode = () => {
  const { mutate, status } = trpc.user.resendVerificationEmail.useMutation()

  useStatusToast(mutationToToastStatus(status), {
    error: {
      title: 'Could not send verification email.',
    },
    success: {
      title: 'Verification email sent!',
      message: 'Please follow the instructions in the received email.',
    },
  })

  return (
    <div>
      <PageTitle>Verification code expired</PageTitle>
      <div className='text-error my-4'>
        Your email could not be verified since your verification code has
        expired.
      </div>
      <Button
        color='primary'
        onClick={() => mutate()}
        loading={status === 'loading'}
        disabled={status === 'success'}
      >
        Restart verification
      </Button>
    </div>
  )
}

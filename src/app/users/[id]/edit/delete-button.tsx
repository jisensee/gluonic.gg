'use client'

import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Button } from 'react-daisyui'
import { signOut } from 'next-auth/react'
import { ConfirmModal } from '@/components/common/modal'
import { trpc } from '@/utils/trpc'
import { useToast } from '@/context/toast-context'

export const DeleteButton = () => {
  const [open, setOpen] = useState(false)
  const { status, isLoading, mutate } = trpc.user.deleteOwn.useMutation()
  const { showToast } = useToast()

  useEffect(() => {
    if (status === 'success') {
      setOpen(false)
      signOut({
        callbackUrl: '/',
      })
    } else if (status === 'error') {
      showToast({
        status: 'error',
        title: 'Could not delete account',
        message: 'Please try again or contact us on discord for assistance.',
      })
    }
  }, [status, showToast])

  return (
    <>
      <ConfirmModal
        open={open}
        onClose={mutate}
        onConfirm={() => setOpen(false)}
        confirmLabel='Delete my account'
        cancelLabel='Cancel'
        title='Delete account'
        loading={isLoading}
      >
        {`This will delete your account and all it's data.`}
        <p className='font-bold'>
          Projects you might manage and posts authored by you will not be
          deleted.
        </p>
        {`Are you sure? This can't be undone.`}
      </ConfirmModal>

      <Button
        color='error'
        startIcon={<FontAwesomeIcon icon={faTrash} />}
        onClick={() => setOpen(true)}
      >
        Delete account
      </Button>
    </>
  )
}

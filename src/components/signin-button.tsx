'use client'

import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-daisyui'
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { Modal } from './common/modal'
import { useEnsureWalletConnected } from '@/hooks/wallet-context'
import { useSignIn } from '@/hooks/auth-hooks'

export const SignInButton = () => {
  const [isMounted, setIsMounted] = useState(false)
  const { signIn, inProgress } = useSignIn()
  const { address } = useAccount()
  const [signModalOpen, setSignModalOpen] = useState(false)
  const { isConnected, ensureWalletConnected } = useEnsureWalletConnected({
    modalArgs: {
      onConnect: () => setSignModalOpen(true),
      topText: <p>To sign in you must connect your wallet first.</p>,
    },
  })

  useEffect(() => {
    setIsMounted(true)
  }, [isMounted])

  if (!isMounted) {
    return null
  }

  return (
    <div>
      <Modal
        title='Sign into Gluonic'
        open={signModalOpen}
        onClose={() => setSignModalOpen(false)}
      >
        <div className='flex flex-col gap-y-2'>
          Account connected with address{' '}
          <span className='text-secondary break-words'>{address}</span>
          <span className='italic text-sm'>
            To sign in with a different account, disconnect this account in your
            wallet first.
          </span>
          <Button
            color='accent'
            loading={inProgress}
            startIcon={<FontAwesomeIcon icon={faEthereum} />}
            onClick={() =>
              signIn(address ?? '').then(() => setSignModalOpen(false))
            }
          >
            Sign message
          </Button>
        </div>
      </Modal>
      <Button
        color='accent'
        startIcon={<FontAwesomeIcon icon={faEthereum} />}
        loading={inProgress}
        onClick={() => {
          if (isConnected && address) {
            setSignModalOpen(true)
          } else {
            ensureWalletConnected()
          }
        }}
      >
        Sign in
      </Button>
    </div>
  )
}

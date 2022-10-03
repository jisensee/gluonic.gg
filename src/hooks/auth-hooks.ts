import { getCsrfToken, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'
import { SiweMessage } from 'siwe'
import { useSignMessage } from 'wagmi'
import { useToast } from '@/context/toast-context'

const signInStatement =
  'Sign into Gluonic with Ethereum. By signing in you agree to our terms of service and privacy policy found at https://gluonic.gg/privacy-tos'
const handleSignIn = async (
  address: string,
  chainId: number,
  signMessage: (message: string) => Promise<string>,
  onError: () => void
) => {
  const message = new SiweMessage({
    domain: window.location.host,
    address,
    statement: signInStatement,
    uri: window.location.origin,
    version: '1',
    chainId,
    nonce: await getCsrfToken(),
  })
  try {
    const signature = await signMessage(message.prepareMessage())
    const response = await signIn('credentials', {
      message: JSON.stringify(message),
      signature,
    })
    return response?.ok ?? false
  } catch {
    onError()
    return false
  }
}

export type WalletConnector = 'browser'

export const useSignIn = () => {
  const [inProgress, setInProgress] = useState(false)
  const [error, setError] = useState(false)
  const { signMessageAsync } = useSignMessage()
  const chainId = 1
  const { showToast } = useToast()

  const signIn = async (address: string) => {
    setInProgress(true)
    if (address) {
      const ok = await handleSignIn(
        address,
        chainId,
        (message) => signMessageAsync({ message }),
        () =>
          showToast({
            status: 'error',
            title: 'Could not sign message!',
            message: 'Please make sure to follow the prompts in your wallet.',
          })
      )
      setInProgress(false)
      if (!ok) {
        setError(true)
      }
    }
  }

  return {
    signIn,
    signOut,
    error,
    inProgress,
  }
}

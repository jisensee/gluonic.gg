import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-daisyui'
import { useAccount } from 'wagmi'
import { useEnsureWalletConnected } from '@/hooks/wallet-context'
import { useSignIn } from '@/hooks/auth-hooks'

export const SignInButton = () => {
  const { signIn, inProgress } = useSignIn()
  const { address } = useAccount()
  const { isConnected, ensureWalletConnected } = useEnsureWalletConnected({
    modalArgs: {
      onConnect: signIn,
      topText: (
        <p>
          To sign in you must connect your wallet. Then sign the prompted
          message to complete the process.
        </p>
      ),
    },
  })

  return (
    <Button
      color='accent'
      startIcon={<FontAwesomeIcon icon={faEthereum} />}
      loading={inProgress}
      onClick={() => {
        if (isConnected && address) {
          signIn(address)
        } else {
          ensureWalletConnected()
        }
      }}
    >
      Sign in
    </Button>
  )
}

import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useAccount } from 'wagmi'
import { WalletConnectModal } from '@/components/wallet-connect-modal'

export type ConnectWalletArgs = {
  topText?: ReactNode
  bottomText?: ReactNode
  onConnect: (address: string) => void
}

export type WalletContext = {
  isConnected: boolean
  address?: string
  ensureWalletConnected: (args: ConnectWalletArgs) => void
}

const Context = createContext<WalletContext>({
  isConnected: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ensureWalletConnected: () => {},
})

export const WalletContextProvider = ({ children }: PropsWithChildren) => {
  const [connectArgs, setConnectArgs] = useState<ConnectWalletArgs>()
  const { address } = useAccount()
  const [showConnectWallet, setShowConnectWallet] = useState(false)

  useEffect(() => {
    if (address) {
      setConnectArgs(undefined)
    }
  }, [address])

  const value: WalletContext = {
    isConnected: !!address,
    ensureWalletConnected: (args) => {
      if (address) {
        args.onConnect(address)
      } else {
        setConnectArgs(args)
        setShowConnectWallet(true)
      }
    },
  }

  return (
    <Context.Provider value={value}>
      {connectArgs && (
        <WalletConnectModal
          open={showConnectWallet && !address}
          onClose={() => setShowConnectWallet(false)}
          {...connectArgs}
        />
      )}
      {children}
    </Context.Provider>
  )
}

export const useEnsureWalletConnected = (config: {
  modalArgs: ConnectWalletArgs
}) => {
  const { isConnected, ensureWalletConnected } = useContext(Context)

  return {
    isConnected,
    ensureWalletConnected: () => ensureWalletConnected(config.modalArgs),
  }
}

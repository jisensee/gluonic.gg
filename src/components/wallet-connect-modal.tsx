import { faClose, faGlobe } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, PropsWithChildren, ReactNode } from 'react'
import { Button, Modal } from 'react-daisyui'
import { Connector, useAccount, useConnect } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { useToast } from '@/context/toast-context'

type ConnectButtonProps = {
  icon: ReactNode
  isConnecting: boolean
  onClick: () => void
} & PropsWithChildren

const ConnectButton: FC<ConnectButtonProps> = ({
  icon,
  isConnecting,
  onClick,
  children,
}) => (
  <Button
    startIcon={icon}
    color='accent'
    onClick={onClick}
    loading={isConnecting}
  >
    {children}
  </Button>
)

export type WalletConnectModalProps = {
  open: boolean
  onClose: () => void
  topText?: ReactNode
  bottomText?: ReactNode
  onConnect?: (address: string) => void
}

export const WalletConnectModal: FC<WalletConnectModalProps> = ({
  open,
  onClose,
  topText,
  bottomText,
  onConnect,
}) => {
  const { isConnecting } = useAccount()
  const { connectAsync } = useConnect()
  const { showToast } = useToast()

  const connect = (connector: Connector) =>
    connectAsync({ connector })
      .then((r) => {
        if (onConnect) {
          onConnect(r.account)
        }
      })
      .catch(() =>
        showToast({
          status: 'error',
          title: 'Could not connect wallet!',
        })
      )

  return (
    <Modal
      className='border border-primary'
      open={open}
      onClickBackdrop={onClose}
    >
      <Modal.Header className='flex flex-row items-center'>
        <span className='grow'>Connect your wallet</span>
        <FontAwesomeIcon
          icon={faClose}
          onClick={onClose}
          className='cursor-pointer hover:text-primary'
        />
      </Modal.Header>
      <Modal.Body className='flex flex-col gap-y-3'>
        {topText}
        <ConnectButton
          icon={
            <img
              src='/wallet-connect-logo.svg'
              className='h-8 w-8'
              alt='wallet connect logo'
            />
          }
          isConnecting={isConnecting}
          onClick={() =>
            connect(
              new WalletConnectConnector({
                chains: [mainnet],
                options: { qrcode: true },
              })
            )
          }
        >
          Wallet Connect
        </ConnectButton>
        <ConnectButton
          icon={
            <img
              src='/metamask-logo.svg'
              className='h-8 w-8'
              alt='metamask logo'
            />
          }
          isConnecting={isConnecting}
          onClick={() => connect(new MetaMaskConnector({ chains: [mainnet] }))}
        >
          MetaMask
        </ConnectButton>
        <ConnectButton
          icon={<FontAwesomeIcon icon={faGlobe} />}
          isConnecting={isConnecting}
          onClick={() => connect(new InjectedConnector())}
        >
          Browser Wallet
        </ConnectButton>
        {bottomText}
      </Modal.Body>
    </Modal>
  )
}

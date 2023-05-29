import { faClose, faGlobe } from '@fortawesome/free-solid-svg-icons'
import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, PropsWithChildren, ReactNode } from 'react'
import { Button, Modal } from 'react-daisyui'
import { Connector, useAccount, useConnect } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { env } from '@/env.mjs'
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

type ListConnector = {
  name: string
  logoUrl?: string
  logoComp?: ReactNode
  connector: Connector
}

const connectors = (): ListConnector[] => [
  {
    name: 'Wallet Connect v1',
    logoUrl: '/wallet-connect-logo.svg',
    connector: new WalletConnectLegacyConnector({
      chains: [mainnet],
      options: {
        qrcode: true,
      },
    }),
  },
  {
    name: 'Metamask',
    logoUrl: '/metamask-logo.svg',
    connector: new MetaMaskConnector({ chains: [mainnet] }),
  },
  {
    name: 'Browser Wallet',
    logoComp: <FontAwesomeIcon icon={faGlobe} />,
    connector: new InjectedConnector({ chains: [mainnet] }),
  },
  {
    name: 'Wallet Connect v2 (experimental)',
    logoUrl: '/wallet-connect-logo.svg',
    connector: new WalletConnectConnector({
      chains: [mainnet],
      options: {
        projectId: env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? '',
        metadata: {
          name: 'Gluonic.gg',
          description: 'Gluonic.gg',
          url: 'https://gluonic.gg',
          icons: ['https://gluonic.gg/android-chrome-512x512.png'],
        },
        showQrModal: true,
        qrModalOptions: {
          themeMode: 'dark',
          themeVariables: {
            '--w3m-z-index': '9999',
          },
        },
      },
    }),
  },
]

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
  const { connectAsync } = useConnect({ chainId: mainnet.id })
  const { showToast } = useToast()

  const connect = (connector: Connector) =>
    connectAsync({ connector, chainId: mainnet.id })
      .then((r) => onConnect?.(r.account))
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
        {connectors().map(({ name, logoUrl, logoComp, connector }) => (
          <ConnectButton
            key={name}
            icon={
              logoUrl ? (
                <div className='relative h-8 w-8'>
                  <Image src={logoUrl} alt={`${name} logo`} fill />
                </div>
              ) : (
                logoComp
              )
            }
            isConnecting={isConnecting}
            onClick={() => connect(connector)}
          >
            {name}
          </ConnectButton>
        ))}
        {bottomText}
      </Modal.Body>
    </Modal>
  )
}

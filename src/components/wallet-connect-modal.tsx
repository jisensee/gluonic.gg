import { faClose, faGlobe } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, ReactNode } from 'react'
import { Button, Modal } from 'react-daisyui'
import { useAccount, useConnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useToast } from '@/context/toast-context'

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
          className='hover:text-primary cursor-pointer'
        />
      </Modal.Header>
      <Modal.Body className='flex flex-col gap-y-3'>
        {topText}
        <Button
          startIcon={<FontAwesomeIcon icon={faGlobe} />}
          color='accent'
          onClick={() =>
            connectAsync({ connector: new InjectedConnector() })
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
          }
          loading={isConnecting}
        >
          Use Browser Wallet
        </Button>
        {bottomText}
      </Modal.Body>
    </Modal>
  )
}

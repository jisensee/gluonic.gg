import { FC, ReactNode } from 'react'
import { Alert, Button } from 'react-daisyui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import { faInfo } from '@fortawesome/free-solid-svg-icons'
import { Modal } from './common/modal'
import { useCopyButton } from '@/hooks/misc-hooks'
import { DonationType, useSendDonation } from '@/hooks/donation-hooks'

export type DonationModalProps = {
  title: ReactNode
  purposeText?: ReactNode
  open: boolean
  onClose: () => void
  targetAddress: string
}

export const DonationModal: FC<DonationModalProps> = ({
  title,
  purposeText,
  open,
  onClose,
  targetAddress,
}) => {
  const sendDonation = useSendDonation(targetAddress)

  const { buttonText, onCopy } = useCopyButton(
    'Copy address',
    'Address copied!'
  )
  const donationButton = (type: DonationType, icon: ReactNode) => (
    <Button startIcon={icon} onClick={() => sendDonation(type)}>
      {`Donate ${type}`}
    </Button>
  )
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className='flex flex-col gap-y-3'>
        <p>
          Thank you for considering to donate! Choose one of the following
          tokens to donate or copy the address to send a transaction manually.
        </p>
        {purposeText}
        {donationButton('eth', <FontAwesomeIcon icon={faEthereum} size='2x' />)}
        {donationButton(
          'dai',
          <img className='h-7' src='/dai-logo.svg' alt='DAI logo' />
        )}
        {donationButton(
          'usdc',
          <img className='h-7' src='/usdc-logo.svg' alt='USDC logo' />
        )}
        <Button onClick={() => onCopy(targetAddress)}>{buttonText}</Button>
        <Alert
          className='text-xl'
          status='info'
          icon={<FontAwesomeIcon icon={faInfo} />}
        >
          Please edit the donation amount manually in your wallet when prompted.
        </Alert>
      </div>
    </Modal>
  )
}

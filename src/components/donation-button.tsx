'use client'

import { faDonate } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, PropsWithChildren, ReactNode, useState } from 'react'
import { Button, ButtonProps } from 'react-daisyui'
import { DonationModal } from './donation-modal'
import { useEnsureWalletConnected } from '@/hooks/wallet-context'

export type DonationButtonProps = {
  targetAddress: string
  className?: string
  modalTitle: ReactNode
  purposeText?: ReactNode
  buttonProps?: ButtonProps
} & PropsWithChildren

export const DonationButton: FC<DonationButtonProps> = ({
  targetAddress,
  children,
  className,
  modalTitle,
  purposeText,
  buttonProps = {},
}) => {
  const [modalOpen, setModalOpen] = useState(false)
  const { ensureWalletConnected } = useEnsureWalletConnected({
    modalArgs: {
      topText: (
        <p>
          To donate you must connect your wallet first. After that you can
          continue with the donation process.
        </p>
      ),
      onConnect: () => setModalOpen(true),
    },
  })

  return (
    <>
      {modalOpen && (
        <DonationModal
          targetAddress={targetAddress}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={modalTitle}
          purposeText={purposeText}
        />
      )}
      <Button
        className={className}
        startIcon={<FontAwesomeIcon icon={faDonate} size='2x' />}
        onClick={() => ensureWalletConnected()}
        {...buttonProps}
      >
        {children}
      </Button>
    </>
  )
}

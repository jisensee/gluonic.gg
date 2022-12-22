import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, PropsWithChildren, ReactNode } from 'react'
import { Button, Modal as DaisyModal } from 'react-daisyui'
import { useEscapeKeyHandler } from '@/hooks/misc-hooks'

export type ModalProps = {
  title: ReactNode
  open: boolean
  onClose: () => void
  actions?: ReactNode
} & PropsWithChildren

export const Modal: FC<ModalProps> = ({
  title,
  open,
  onClose,
  actions,
  children,
}) => {
  useEscapeKeyHandler(onClose)

  return (
    <DaisyModal
      className='border border-primary'
      open={open}
      onClickBackdrop={onClose}
    >
      <DaisyModal.Header className='flex flex-row items-center'>
        <span className='grow'>{title}</span>
        <FontAwesomeIcon
          icon={faClose}
          onClick={onClose}
          className='cursor-pointer hover:text-primary'
        />
      </DaisyModal.Header>
      <DaisyModal.Body>{children}</DaisyModal.Body>
      {actions && (
        <DaisyModal.Actions className='flex-wrap gap-y-2'>
          {actions}
        </DaisyModal.Actions>
      )}
    </DaisyModal>
  )
}

type ConfirmModalProps = {
  onConfirm: () => void
  confirmLabel: ReactNode
  cancelLabel?: ReactNode
} & Omit<ModalProps, 'actions'>

export const ConfirmModal: FC<ConfirmModalProps> = ({
  onConfirm,
  confirmLabel,
  cancelLabel = 'Cancel',
  ...props
}) => (
  <Modal
    {...props}
    actions={
      <>
        <Button onClick={props.onClose}>{cancelLabel}</Button>
        <Button
          color='error'
          onClick={() => {
            props.onClose()
            onConfirm()
          }}
        >
          {confirmLabel}
        </Button>
      </>
    }
  />
)

import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, PropsWithChildren, ReactNode } from 'react'
import { Modal as DaisyModal } from 'react-daisyui'

export type ModalProps = {
  title: ReactNode
  open: boolean
  onClose: () => void
} & PropsWithChildren

export const Modal: FC<ModalProps> = ({ title, open, onClose, children }) => {
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
          className='hover:text-primary cursor-pointer'
        />
      </DaisyModal.Header>
      <DaisyModal.Body>{children}</DaisyModal.Body>
    </DaisyModal>
  )
}

import { IconDefinition } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, ReactNode } from 'react'
import { Button, ButtonProps, InputGroup } from 'react-daisyui'
import classNames from 'classnames'
import { faSave } from '@fortawesome/free-solid-svg-icons'
import { FieldError } from 'react-hook-form'
import { ComponentColor } from 'react-daisyui/dist/types'

type FormFieldProps = {
  className?: string
  label: ReactNode
  error?: FieldError
  infoMessage?: ReactNode
  children: ReactNode
}
export const FormField: FC<FormFieldProps> = ({
  className,
  label,
  error,
  infoMessage,
  children,
}) => (
  <div className={classNames('form-control', className)}>
    <label className='label font-bold text-lg'>{label}</label>
    {children}
    {error?.message && (
      <span className='text-error mt-1 first-letter:capitalize'>
        {error.message}
      </span>
    )}
    {infoMessage && <span className='italic mt-1'>{infoMessage}</span>}
  </div>
)

export type IconInputProps = {
  children: ReactNode
  icon: IconDefinition
  className?: string
}
export const IconInput: FC<IconInputProps> = ({
  children,
  icon,
  className,
}) => (
  <InputGroup
    className={classNames('items-center gap-x-3 rounded-2xl', className)}
  >
    <FontAwesomeIcon icon={icon} size='2x' fixedWidth />
    {children}
  </InputGroup>
)

export const SaveButton = (props: ButtonProps) => (
  <Button
    children='Save'
    startIcon={<FontAwesomeIcon icon={faSave} />}
    color='primary'
    {...props}
  />
)

export const errorColor = (
  error?: FieldError,
  defaultColor?: ComponentColor
): ComponentColor | undefined => (error ? 'error' : defaultColor)

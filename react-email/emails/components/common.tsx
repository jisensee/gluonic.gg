import { ComponentProps, FC } from 'react'
import { Button as EButton } from '@react-email/button'
import { Link as ELink } from '@react-email/link'
import classNames from 'classnames'

export const Button: FC<ComponentProps<typeof EButton>> = ({
  className,
  ...props
}) => (
  <EButton
    className={classNames(
      'text-md rounded-lg bg-primary px-4 py-3 font-bold uppercase text-primary-content',
      className
    )}
    {...props}
  />
)

export const Link: FC<ComponentProps<typeof ELink>> = ({
  className,
  ...props
}) => (
  <ELink
    className={classNames('text-secondary hover:text-primary', className)}
    {...props}
  />
)

export const buildUrl = (path: string) => {
  const base = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'
  return `${base}${path}`
}

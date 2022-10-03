import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, PropsWithChildren } from 'react'
import { Button, ButtonProps } from 'react-daisyui'
import { Link } from '../link'

export type LinkButtonProps = {
  className?: string
  icon?: IconDefinition
  href: string
  external?: boolean
  button?: ButtonProps
} & PropsWithChildren

export const LinkButton: FC<LinkButtonProps> = ({
  className,
  icon,
  href,
  external,
  button,
  children,
}) => (
  <Link className={className} href={href} external={external}>
    <Button startIcon={icon && <FontAwesomeIcon icon={icon} />} {...button}>
      {children}
    </Button>
  </Link>
)

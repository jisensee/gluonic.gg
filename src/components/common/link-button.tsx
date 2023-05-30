'use client'

import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome'
import { FC, PropsWithChildren } from 'react'
import { Button, ButtonProps } from 'react-daisyui'
import { Link } from '../link'

export type LinkButtonProps = {
  className?: string
  icon?: IconDefinition
  href: string
  external?: boolean
  button?: ButtonProps
  iconProps?: Partial<FontAwesomeIconProps>
} & PropsWithChildren

export const LinkButton: FC<LinkButtonProps> = ({
  className,
  icon,
  href,
  external,
  button,
  iconProps,
  children,
}) => (
  <Link className={className} href={href} external={external}>
    <Button
      startIcon={icon && <FontAwesomeIcon icon={icon} {...iconProps} />}
      {...button}
    >
      {children}
    </Button>
  </Link>
)

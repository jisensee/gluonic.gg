'use client'

import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FC, PropsWithChildren } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'

type RequestStatusProps = {
  icon: IconDefinition
  className?: string
} & PropsWithChildren

export const RequestStatus: FC<RequestStatusProps> = ({
  icon,
  children,
  className,
}) => (
  <div
    className={classNames(
      'flex flex-row items-center gap-x-3 text-xl',
      className
    )}
  >
    <FontAwesomeIcon icon={icon} />
    {children}
  </div>
)

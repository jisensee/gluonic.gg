import { FC, HTMLAttributeAnchorTarget, PropsWithChildren } from 'react'
import NextLink from 'next/link'
import classNames from 'classnames'
import { Route } from 'next'

type LinkProps = {
  href: string
  target?: HTMLAttributeAnchorTarget
  external?: boolean
  highlight?: boolean
  className?: string
}
export const Link: FC<PropsWithChildren<LinkProps>> = ({
  href,
  external,
  target,
  children,
  highlight,
  className,
}) => {
  return (
    <NextLink
      className={classNames(
        { 'font-bold text-secondary hover:text-primary ': highlight },
        className
      )}
      href={href as Route}
      target={external ? '_blank' : target}
    >
      {children}
    </NextLink>
  )
}

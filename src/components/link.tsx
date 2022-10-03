import { UrlObject } from 'url'
import { FC, HTMLAttributeAnchorTarget, PropsWithChildren } from 'react'
import NextLink from 'next/link'
import classNames from 'classnames'

type LinkProps = {
  href: string | UrlObject
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
}) => (
  <NextLink href={href} passHref>
    <a
      className={classNames(
        { 'font-bold text-secondary hover:text-primary ': highlight },
        className
      )}
      target={external ? '_blank' : target}
    >
      {children}
    </a>
  </NextLink>
)

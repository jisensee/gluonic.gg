import classNames from 'classnames'
import { FC, PropsWithChildren, ReactNode } from 'react'

export type PageTitleProps = {
  className?: string
  rightElement?: ReactNode
} & PropsWithChildren
export const PageTitle: FC<PageTitleProps> = ({
  className,
  children,
  rightElement,
}) => (
  <div
    className={classNames(
      'flex flex-row items-center justify-between',
      className
    )}
  >
    <h1>{children}</h1>
    {rightElement}
  </div>
)

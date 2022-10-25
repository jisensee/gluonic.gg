import classNames from 'classnames'
import { FC, PropsWithChildren, ReactNode } from 'react'

export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left'

const positionClasses = (position: TooltipPosition) => {
  const leftRight =
    'top-1/2 -translate-y-1/2 after:top-1/2 after:-translate-y-1/2'
  const topBottom =
    'left-1/2 -translate-x-1/2 after:left-1/2 after:-translate-x-1/2'

  switch (position) {
    case 'top':
      return classNames(
        topBottom,
        'bottom-full after:top-full after:border-t-base-300  mb-[10px]'
      )
    case 'bottom':
      return classNames(
        topBottom,
        'top-full after:bottom-full after:border-b-base-300 mt-[10px]'
      )
    case 'right':
      return classNames(
        leftRight,
        'left-full after:right-full after:border-r-base-300 ml-[10px]'
      )
    case 'left':
      return classNames(
        leftRight,
        'right-full after:left-full after:border-l-base-300 mr-[10px]'
      )
  }
}

type TooltipProps = {
  content: ReactNode
  position?: TooltipPosition
  className?: string
} & PropsWithChildren

export const Tooltip: FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className,
}) => (
  <div className='group relative'>
    <div
      className={classNames(
        'hidden group-hover:flex',
        'absolute w-fit z-50',
        'rounded-xl bg-base-300 p-3',
        'after:absolute after:border-[10px] after:border-transparent',
        positionClasses(position),
        className
      )}
    >
      {content}
    </div>
    {children}
  </div>
)

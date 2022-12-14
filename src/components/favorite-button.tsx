import { faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { FC } from 'react'
import { Tooltip } from './common/tooltip'
import { FavoriteState } from '@/hooks/favorite-hooks'

export type FavoriteButtonProps = {
  state: FavoriteState
  onToggle?: () => void
  className?: string
}
export const FavoriteButton: FC<FavoriteButtonProps> = ({
  state,
  onToggle,
  className,
}) => {
  const content = (
    <div
      className={classNames('flex flex-row items-center gap-x-2', className)}
    >
      <span className='font-bold'>{state.count}</span>
      <FontAwesomeIcon
        onClick={onToggle}
        className={classNames('cursor-pointer text-2xl', {
          'text-primary': state.favorited,
          'hover:text-current': onToggle && state.favorited,
          'hover:text-primary': onToggle && !state.favorited,
        })}
        icon={faStar}
      />
    </div>
  )
  return onToggle ? (
    content
  ) : (
    <Tooltip
      className='text-md mr-4 whitespace-nowrap'
      position='left'
      content='Sign in to favorite projects'
    >
      {content}
    </Tooltip>
  )
}

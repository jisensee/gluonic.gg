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
}) => (
  <Tooltip
    className={classNames(
      'text-md whitespace-nowrap mr-4',
      onToggle && 'hidden'
    )}
    position='left'
    content='Sign in to favorite projects'
  >
    <div
      className={classNames('flex flex-row gap-x-2 items-center', className)}
    >
      <span className='font-bold'>{state.count}</span>
      <FontAwesomeIcon
        onClick={onToggle}
        className={classNames('text-2xl cursor-pointer', {
          'text-primary': state.favorited,
          'hover:text-current': onToggle && state.favorited,
          'hover:text-primary': onToggle && !state.favorited,
        })}
        icon={faStar}
      />
    </div>
  </Tooltip>
)

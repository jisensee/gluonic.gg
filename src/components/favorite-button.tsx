import { faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { FC } from 'react'
import { FavoriteState } from '@/hooks/favorite-hooks'

export type FavoriteButtonProps = {
  state: FavoriteState
  onToggle?: () => void
}
export const FavoriteButton: FC<FavoriteButtonProps> = ({
  state,
  onToggle,
}) => (
  <div className='flex flex-row gap-x-2 items-center'>
    <span className='font-bold'>{state.count}</span>
    <FontAwesomeIcon
      onClick={onToggle}
      className={classNames('text-2xl', {
        'cursor-pointer': onToggle,
        'text-primary': state.favorited,
        'hover:text-current': onToggle && state.favorited,
        'hover:text-primary': onToggle && !state.favorited,
      })}
      icon={faStar}
    />
  </div>
)

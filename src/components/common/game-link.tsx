import classNames from 'classnames'
import { FC } from 'react'
import { Link } from '../link'

export type GameLinkProps = {
  className?: string
  gameKey: string
  name: string
  logoUrl: string
}
export const GameLink: FC<GameLinkProps> = ({
  className,
  gameKey,
  name,
  logoUrl,
}) => (
  <Link
    className={classNames('flex flex-row items-center gap-x-3', className)}
    href={`/${gameKey}`}
    highlight
  >
    <img className='h-8' src={logoUrl} alt={`${name} logo`} />
    <span className='font-bold text-lg'>{name}</span>
  </Link>
)

import classNames from 'classnames'
import Image from 'next/image'
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
    <div className='relative h-8 w-8'>
      <Image
        className='object-contain'
        src={logoUrl}
        alt={`${name} logo`}
        fill
      />
    </div>
    <span className='text-lg font-bold'>{name}</span>
  </Link>
)

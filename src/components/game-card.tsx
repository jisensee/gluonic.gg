'use client'

import Image from 'next/image'
import { Game, Socials } from '@prisma/client'
import classNames from 'classnames'
import { FC } from 'react'
import { Card } from 'react-daisyui'
import { faGlobe, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { Link } from './link'
import { LinkButton } from './common/link-button'
import { SocialLinks } from './social-links'
import {
  Subscribers,
  SubscribersProps,
} from '@/app/[game]/[project]/subscribers'

export type GameCardProps = {
  className?: string
  game: Game
  socials: Socials
  projectCount: number
  subscribersProps: SubscribersProps
}

export const GameCard: FC<GameCardProps> = ({
  className,
  game,
  socials,
  projectCount,
  subscribersProps,
}) => {
  const detailLink = `/${game.key}`
  const logoAndTitle = (
    <Link className='flex flex-row items-center gap-x-3' href={detailLink}>
      <div className='relative h-12 w-12'>
        <Image
          className='object-contain'
          src={game.logoUrl}
          alt={`${game.name} logo`}
          fill
        />
      </div>
      <h2 className='text-primary'>{game.name}</h2>
    </Link>
  )
  return (
    <Card
      side
      className={classNames(
        'flex flex-col gap-y-3 border-primary bg-base-200 px-5 py-3',
        className
      )}
    >
      <div className='flex flex-row items-center justify-between'>
        {logoAndTitle}
        <SocialLinks
          className='ml-3 hidden grow flex-row items-center gap-x-5 text-3xl lg:flex'
          socials={socials}
          tooltipPosition='bottom'
        />
        <Subscribers {...subscribersProps} />
      </div>
      <p>{game.description}</p>
      <div className='flex flex-row flex-wrap items-center justify-center gap-x-5 gap-y-3'>
        <LinkButton
          icon={faMagnifyingGlass}
          button={{ color: 'primary' }}
          iconProps={{ size: '2x' }}
          href={detailLink}
        >
          Discover {projectCount} projects
        </LinkButton>
        <LinkButton
          icon={faGlobe}
          button={{ color: 'secondary' }}
          iconProps={{ size: '2x' }}
          href={game.website}
          external
        >
          Visit website
        </LinkButton>
      </div>
      <SocialLinks
        className='flex flex-row items-center justify-center gap-x-5 text-3xl lg:hidden'
        socials={socials}
        tooltipPosition='bottom'
        compact
      />
    </Card>
  )
}

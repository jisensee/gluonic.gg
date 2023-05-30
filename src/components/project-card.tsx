'use client'

import Image from 'next/image'
import { faGlobe, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { Game, Project, Socials } from '@prisma/client'
import { FC } from 'react'
import { Card } from 'react-daisyui'
import { Link } from './link'
import { SocialLinks } from './social-links'
import { LinkButton } from './common/link-button'
import { FavoriteButton } from './favorite-button'
import {
  Subscribers,
  SubscribersProps,
} from '@/app/[game]/[project]/subscribers'
import { FavoriteState, useFavoriteState } from '@/hooks/favorite-hooks'
export type ProjectCardProps = {
  project: Project
  socials: Socials
  game: Game
  favoriteState: FavoriteState
  onFavoriteToggle?: () => void
  onSubscribeClick?: () => void
  subscribersProps?: SubscribersProps
}

export const ProjectCard: FC<ProjectCardProps> = ({
  project,
  game,
  socials,
  favoriteState,
  onFavoriteToggle,
  subscribersProps,
}) => {
  const { localFavoriteState, toggleFavorite } = useFavoriteState(
    favoriteState,
    onFavoriteToggle
  )
  const detailLink = `/${game.key}/${project.key}`
  const logoAndTitle = (
    <Link className='flex flex-row items-center gap-x-3' href={detailLink}>
      <div className='relative h-12 w-12'>
        <Image
          className='object-contain'
          src={project.logoUrl ?? game.logoUrl}
          alt={`${project.name} logo`}
          fill
        />
      </div>
      <h2 className='text-primary'>{project.name}</h2>
    </Link>
  )
  return (
    <Card
      side
      className='flex flex-col gap-y-3 border-primary bg-base-200 px-5 py-3'
    >
      <div className='flex flex-row flex-wrap items-center justify-between gap-3'>
        {logoAndTitle}
        <SocialLinks
          className='hidden grow flex-row items-center gap-x-5 text-3xl lg:flex'
          socials={socials}
          tooltipPosition='bottom'
        />
        <div className='flex flex-row gap-x-5'>
          {subscribersProps && <Subscribers {...subscribersProps} />}
          <FavoriteButton
            state={localFavoriteState}
            onToggle={toggleFavorite}
          />
        </div>
      </div>
      <p>{project.abstract}</p>
      <div className='flex flex-row flex-wrap items-center justify-center gap-x-5 gap-y-3'>
        <LinkButton
          icon={faMagnifyingGlass}
          button={{ color: 'primary' }}
          iconProps={{ size: '2x' }}
          href={detailLink}
        >
          Show project page
        </LinkButton>
        <LinkButton
          icon={faGlobe}
          button={{ color: 'secondary' }}
          iconProps={{ size: '2x' }}
          href={project.website}
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

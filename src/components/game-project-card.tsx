'use client'

import {
  faGlobe,
  faMagnifyingGlass,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Game, Project, Socials } from '@prisma/client'
import classNames from 'classnames'
import { FC, ReactNode } from 'react'
import { Button, Card } from 'react-daisyui'
import { Link } from './link'
import { SocialLinks } from './social-links'
import { FavoriteButton } from './favorite-button'
import { FavoriteState, useFavoriteState } from '@/hooks/favorite-hooks'

export type GameProjectCardProps = {
  className?: string
  detailLink: Route
  detailText: ReactNode
  detailIcon: IconDefinition
  title: string
  abstract: string
  logoUrl: string
  website: string
  socials: Socials
  favoriteState?: FavoriteState
  onFavoriteToggle?: () => void
}
export const GameProjectCard: FC<GameProjectCardProps> = ({
  detailLink,
  detailText,
  detailIcon,
  title,
  abstract,
  logoUrl,
  website,
  socials,
  favoriteState,
  onFavoriteToggle,
  className,
}) => (
  <Card
    side
    className={classNames(
      'flex flex-col gap-y-3 border-primary bg-base-200 py-3 px-5',
      className
    )}
  >
    <div className='flex flex-row items-start gap-x-3 md:items-center'>
      <Link className='hidden w-16 md:flex' href={detailLink}>
        <img
          className='w-full min-w-full'
          src={logoUrl}
          alt={`${title} logo`}
        />
      </Link>
      <div className='flex grow flex-row flex-wrap items-center gap-x-5'>
        <h2 className='text-primary'>{title}</h2>
        <SocialLinks
          className='flex flex-row items-center gap-x-5 text-2xl md:hidden'
          socials={socials}
          compact
          tooltipPosition='bottom'
        />
        <SocialLinks
          className='hidden flex-row items-center gap-x-5 text-2xl md:flex'
          socials={socials}
          tooltipPosition='bottom'
        />
      </div>
      {favoriteState && (
        <FavoriteButton
          className='mt-1 md:mt-0'
          state={favoriteState}
          onToggle={onFavoriteToggle}
        />
      )}
    </div>
    <p>{abstract}</p>
    <div className='flex flex-col items-center justify-center gap-x-5 gap-y-3 sm:flex-row'>
      <Link href={detailLink}>
        <Button
          color='primary'
          startIcon={<FontAwesomeIcon icon={detailIcon} size='2x' />}
        >
          {detailText}
        </Button>
      </Link>
      <Link href={website} target='_blank'>
        <Button
          color='secondary'
          startIcon={<FontAwesomeIcon icon={faGlobe} size='2x' />}
        >
          Visit website
        </Button>
      </Link>
    </div>
  </Card>
)

export type ProjectCardProps = {
  project: Project
  socials: Socials
  game: Game
  favoriteState: FavoriteState
  onFavoriteToggle?: () => void
}
export const ProjectCard: FC<ProjectCardProps> = ({
  project,
  game,
  socials,
  favoriteState,
  onFavoriteToggle,
}) => {
  const { localFavoriteState, toggleFavorite } = useFavoriteState(
    favoriteState,
    onFavoriteToggle
  )
  return (
    <GameProjectCard
      key={project.id}
      title={project.name}
      abstract={project.abstract}
      website={project.website}
      logoUrl={project.logoUrl ?? game.logoUrl}
      detailLink={`/${game.key}/${project.key}`}
      detailText='Show project page'
      detailIcon={faMagnifyingGlass}
      socials={socials}
      favoriteState={localFavoriteState}
      onFavoriteToggle={toggleFavorite}
    />
  )
}

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
  detailLink: string
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
      'flex flex-col gap-y-3 border-primary py-3 px-5 bg-base-200',
      className
    )}
  >
    <div className='flex flex-row gap-x-3 items-center'>
      <Link className='w-14 md:w-14' href={detailLink}>
        <img
          className='w-full min-w-full'
          src={logoUrl}
          alt={`${title} logo`}
        />
      </Link>
      <div className='flex flex-row gap-x-5 flex-wrap items-center grow'>
        <h2 className='text-primary'>{title}</h2>
        <SocialLinks
          className='flex md:hidden flex-row gap-x-5 text-2xl items-center'
          socials={socials}
          compact
          tooltipPosition='bottom'
        />
        <SocialLinks
          className='hidden md:flex flex-row gap-x-5 text-2xl items-center'
          socials={socials}
          tooltipPosition='bottom'
        />
      </div>
      {favoriteState && (
        <FavoriteButton state={favoriteState} onToggle={onFavoriteToggle} />
      )}
    </div>
    <p>{abstract}</p>
    <div className='flex flex-col sm:flex-row items-center justify-center gap-x-5 gap-y-3'>
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

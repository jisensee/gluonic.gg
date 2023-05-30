'use client'

import { Game, Project, Socials } from '@prisma/client'
import { useFavoriteProjectsList } from '@/hooks/favorite-hooks'
import { ProjectCard } from '@/components/project-card'

type FavoriteListProps = {
  projects: (Project & {
    game: Game
    socials: Socials
    _count: { favoritedBy: number }
  })[]
}
export const FavoriteList = ({ projects }: FavoriteListProps) => {
  const { isFavorited, toggleFavorite } = useFavoriteProjectsList(
    projects.map((p) => p.id)
  )
  return (
    <div className='flex flex-col gap-y-3'>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          game={project.game}
          socials={project.socials}
          favoriteState={{
            favorited: isFavorited(project.id),
            count: project._count.favoritedBy,
          }}
          onFavoriteToggle={() => toggleFavorite?.(project.id)}
        />
      ))}
    </div>
  )
}

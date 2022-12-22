'use client'

import { Game, Project, Socials } from '@prisma/client'
import { FC } from 'react'
import { useFavoriteProjectsList } from '@/hooks/favorite-hooks'
import { ProjectCard } from '@/components/game-project-card'

type ProjectsProps = {
  game: Game
  projects: (Project & {
    socials: Socials
    _count: { favoritedBy: number }
  })[]
  favoritedProjectIds?: string[]
}

export const Projects: FC<ProjectsProps> = ({
  projects,
  favoritedProjectIds,
  game,
}) => {
  const { isFavorited, toggleFavorite } =
    useFavoriteProjectsList(favoritedProjectIds)

  return (
    <>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          game={game}
          socials={project.socials}
          favoriteState={{
            count: project._count.favoritedBy,
            favorited: isFavorited(project.id),
          }}
          onFavoriteToggle={
            toggleFavorite ? () => toggleFavorite(project.id) : undefined
          }
        />
      ))}
    </>
  )
}

'use client'

import { Game, Project, Socials } from '@prisma/client'
import { FC } from 'react'
import { useFavoriteProjectsList } from '@/hooks/favorite-hooks'
import { ProjectCard } from '@/components/project-card'

type UserProjectsProps = {
  projects: (Project & {
    game: Game
    socials: Socials
    _count: { favoritedBy: number }
  })[]
  favoritedProjectIds: string[]
}

export const UserProjects: FC<UserProjectsProps> = ({
  projects,
  favoritedProjectIds,
}) => {
  const { isFavorited, toggleFavorite } =
    useFavoriteProjectsList(favoritedProjectIds)
  return projects.length > 0 ? (
    <div className='flex flex-col gap-y-3'>
      <h2>Their projects</h2>
      {projects.map((project) => (
        <ProjectCard
          key={project.key}
          project={project}
          game={project.game}
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
    </div>
  ) : null
}

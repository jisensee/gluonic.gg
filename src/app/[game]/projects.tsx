'use client'

import { Game, Project, Socials, Subscription } from '@prisma/client'
import { FC } from 'react'
import { useFavoriteProjectsList } from '@/hooks/favorite-hooks'
import { ProjectCard } from '@/components/game-project-card'

type ProjectsProps = {
  game: Game
  projects: (Project & {
    socials: Socials
    _count: { favoritedBy: number; subscriptions: number }
  })[]
  favoritedProjectIds?: string[]
  subscriptions: Subscription[]
  loggedIn: boolean
  hasVerifiedEmail?: boolean
  receiveEmails?: boolean
}

export const Projects: FC<ProjectsProps> = ({
  projects,
  favoritedProjectIds,
  game,
  subscriptions,
  loggedIn,
  hasVerifiedEmail,
  receiveEmails,
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
          subscribersProps={{
            project,
            subscription: subscriptions.find((s) => s.projectId === project.id),
            loggedIn,
            hasVerifiedEmail,
            receiveEmails,
            subscriberCount: project._count.subscriptions,
          }}
        />
      ))}
    </>
  )
}

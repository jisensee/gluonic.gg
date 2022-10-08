import { Game, Project, Socials } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { withUser } from '@/server/server-utils'
import { db } from '@/server/db'
import { PageTitle } from '@/components/common/page-title'
import { ProjectCard } from '@/components/game-project-card'
import { useFavoriteProjectsList } from '@/hooks/favorite-hooks'

type Props = {
  projects: (Project & {
    game: Game
    socials: Socials
    _count: { favoritedBy: number }
  })[]
}

export const getServerSideProps: GetServerSideProps<Props> = (context) =>
  withUser(context, async (user) => {
    const projects = await db.user
      .findUnique({
        where: { id: user.id },
        include: {
          favoritedProjects: {
            include: {
              game: true,
              socials: true,
              _count: { select: { favoritedBy: true } },
            },
          },
        },
      })
      .then((u) => u?.favoritedProjects ?? [])
    return { props: { projects } }
  })

export default function MyFavoritesPage({ projects }: Props) {
  const { isFavorited, toggleFavorite } = useFavoriteProjectsList(
    projects.map((p) => p.id)
  )
  return (
    <div className='flex flex-col gap-y-3'>
      <PageTitle>My Favorites</PageTitle>
      {projects.length === 0 && <p>You have not favorited any projects yet.</p>}
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
          onFavoriteToggle={() => toggleFavorite(project.id)}
        />
      ))}
    </div>
  )
}

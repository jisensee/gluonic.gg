import type { Game, Project, Socials } from '@prisma/client'
import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import { prisma } from '@/server/db/client'
import { ProjectCard } from '@/components/game-project-card'
import { LinkButton } from '@/components/common/link-button'
import { SocialLinks } from '@/components/social-links'
import { withOptionalUser } from '@/server/server-utils'
import { UserService } from '@/server/user-service'
import { useFavoriteProjectsList } from '@/hooks/favorite-hooks'

type Props = {
  game: Game & {
    socials: Socials
    projects: (Project & {
      socials: Socials
      _count: { favoritedBy: number }
    })[]
  }
  favoritedProjectIds?: string[]
}

export const getServerSideProps: GetServerSideProps<Props> = (context) =>
  withOptionalUser(context, async (maybeUser) => {
    const key = context.query['game'] as string

    const user = maybeUser.extract()
    const favoritedProjectIds = user
      ? await UserService.findFavoritedProjectIds(user)
      : undefined

    const game = await prisma.game.findUnique({
      where: { key },
      include: {
        socials: true,
        projects: {
          where: { published: true },
          include: { socials: true, _count: { select: { favoritedBy: true } } },
          orderBy: [
            {
              lastUpdate: 'desc',
            },
          ],
        },
      },
    })

    return game
      ? {
          props: { game, favoritedProjectIds },
        }
      : Promise.resolve({ notFound: true })
  })

export default function GamePage({ game, favoritedProjectIds }: Props) {
  const { isFavorited, toggleFavorite } =
    useFavoriteProjectsList(favoritedProjectIds)
  return (
    <>
      <Head>
        <title>{game.name}</title>
      </Head>
      <div className='flex flex-col gap-y-3'>
        <div className='flex flex-row flex-wrap items-center justify-center gap-x-8 gap-y-2 rounded-2xl bg-base-200 p-3 sm:justify-start'>
          <div className='mr-auto flex flex-row items-center gap-x-3'>
            <img
              className='h-10'
              src={game.logoUrl}
              alt={`${game.name} logo`}
            />
            <h1>{game.name}</h1>
          </div>
          <LinkButton
            href={game.website}
            icon={faGlobe}
            button={{ color: 'secondary' }}
            external
          >
            Website
          </LinkButton>
          <SocialLinks
            className='flex flex-row items-center gap-x-3 text-4xl md:hidden'
            socials={game.socials}
            compact
          />
          <SocialLinks
            className='hidden flex-row items-center gap-x-3 text-4xl md:flex'
            socials={game.socials}
          />
        </div>
        {game.projects.map((project) => (
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
      </div>
    </>
  )
}

import { Game, Project, Socials, User } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { Button } from 'react-daisyui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import Head from 'next/head'
import { db } from '@/server/db'
import { SocialLinks } from '@/components/social-links'
import { Link } from '@/components/link'
import { ProjectCard } from '@/components/game-project-card'
import { PageTitle } from '@/components/common/page-title'
import { shortenAddress } from '@/format'
import { withOptionalUser } from '@/server/server-utils'
import { UserService } from '@/server/user-service'
import { useFavoriteProjectsList } from '@/hooks/favorite-hooks'

type Props = {
  user: User
  socials: Socials
  projects: (Project & {
    socials: Socials
    game: Game
    _count: { favoritedBy: number }
  })[]
  sameUser: boolean
  favoritedProjectIds?: string[]
}

export const getServerSideProps: GetServerSideProps<Props> = (context) =>
  withOptionalUser(context, async (maybeUser) => {
    const id = context.query['id'] as string
    const requestingUser = maybeUser.extract()
    const favoritedProjectIds = requestingUser
      ? await UserService.findFavoritedProjectIds(requestingUser)
      : undefined
    const user = await db.user.findUnique({
      where: { id },
      include: {
        socials: true,
        projectAuthorships: {
          where: { project: { published: true } },
          include: {
            project: {
              include: {
                game: true,
                socials: true,
                _count: { select: { favoritedBy: true } },
              },
            },
          },
        },
      },
    })
    if (!user) {
      return Promise.resolve({ notFound: true })
    }

    const sameUser = maybeUser.mapOrDefault((u) => u.id === user.id, false)

    return {
      props: {
        sameUser,
        user,
        projects: user.projectAuthorships.map((a) => a.project),
        socials: user.socials,
        favoritedProjectIds,
      },
    }
  })

export default function UserPage({
  user,
  socials,
  projects,
  sameUser,
  favoritedProjectIds,
}: Props) {
  const { isFavorited, toggleFavorite } =
    useFavoriteProjectsList(favoritedProjectIds)
  return (
    <div className='flex flex-col gap-y-3'>
      <Head>
        <title>{user.name}</title>
      </Head>
      <PageTitle
        rightElement={
          sameUser && (
            <Link href={`/users/${user.id}/edit`}>
              <Button
                startIcon={<FontAwesomeIcon icon={faEdit} />}
                color='primary'
              >
                Edit data
              </Button>
            </Link>
          )
        }
      >
        {user.name ?? (
          <>
            <span className='hidden lg:flex'>{user.address}</span>
            <span className='lg:hidden'>{shortenAddress(user.address)}</span>
          </>
        )}
      </PageTitle>
      <span className='italic'>
        Member since {user.joinedAt.toLocaleDateString()}
      </span>
      {user.bio && <p>{user.bio}</p>}
      <SocialLinks
        className='flex flex-row flex-wrap gap-5 justify-center sm:justify-start'
        socials={socials}
      />
      {projects.length > 0 ? (
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
      ) : null}
    </div>
  )
}

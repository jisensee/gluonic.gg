import { Game, Project, Socials, User } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { faEdit, faGlobe } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-daisyui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Maybe } from 'purify-ts'
import Head from 'next/head'
import { FC, useState } from 'react'
import { db } from '@/server/db'
import { SocialLinks } from '@/components/social-links'
import { Markdown } from '@/components/markdown'
import { DonationButton } from '@/components/donation-button'
import { canUserManageProject, withOptionalUser } from '@/server/server-utils'
import { Link } from '@/components/link'
import { GameLink } from '@/components/common/game-link'
import { PageTitle } from '@/components/common/page-title'
import { LinkButton } from '@/components/common/link-button'
import { FavoriteState, useFavoriteState } from '@/hooks/favorite-hooks'
import { useToggleFavoriteProjectMutation } from '@/generated/graphql-hooks'
import { FavoriteButton } from '@/components/favorite-button'

type Props = {
  project: Project & {
    _count: { favoritedBy: number }
    socials: Socials
    game: Game
  }
  authors: User[]
  canManage: boolean
  isFavorited: boolean
  canFavorite: boolean
}

const projectVisible = async (project: Project, maybeUser: Maybe<User>) => {
  if (project.published) {
    return true
  }
  return maybeUser.mapOrDefault(
    (user) => canUserManageProject(project, user),
    Promise.resolve(false)
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) =>
  withOptionalUser<Props>(context, async (maybeUser) => {
    const gameKey = context.query['game'] as string
    const projectKey = context.query['project'] as string
    const project = await db.project.findFirst({
      where: { key: projectKey, game: { key: gameKey } },
      include: {
        _count: { select: { favoritedBy: true } },
        socials: true,
        game: true,
        projectAuthorships: { include: { user: true } },
      },
    })

    if (!project || !(await projectVisible(project, maybeUser))) {
      return Promise.resolve({ notFound: true })
    }

    const user = maybeUser.extract()
    const isFavorited = user
      ? await db.user
          .findUnique({
            where: { id: user.id },
            include: { favoritedProjects: { where: { id: project.id } } },
          })
          .then((r) => r?.favoritedProjects ?? [])
          .then((p) => p.length > 0)
      : false
    const canManage = user ? await canUserManageProject(project, user) : false
    return {
      props: {
        project,
        authors: project.projectAuthorships.map((a) => a.user),
        canManage,
        isFavorited,
        canFavorite: !!user,
      },
    }
  })

type FavoritesProps = {
  state: FavoriteState
  projectId: string
  canFavorite: boolean
}
const Favorites: FC<FavoritesProps> = ({
  state: { favorited, count },
  projectId,
  canFavorite,
}) => {
  const { mutateAsync } = useToggleFavoriteProjectMutation()
  const [serverFavorited, setServerFavorited] = useState(favorited)
  const { localFavoriteState, toggleFavorite } = useFavoriteState(
    {
      favorited: serverFavorited,
      count,
    },
    canFavorite
      ? () =>
          mutateAsync({ projectId: projectId }).then((r) =>
            setServerFavorited(r.toggleFavoriteProject)
          )
      : undefined
  )

  return <FavoriteButton state={localFavoriteState} onToggle={toggleFavorite} />
}

export default function ProjectPage({
  project,
  authors,
  canManage,
  isFavorited,
  canFavorite,
}: Props) {
  const Header = () => (
    <div className='flex flex-col gap-y-2'>
      <PageTitle
        rightElement={
          <div className='flex flex-row gap-x-10 items-center'>
            <Favorites
              state={{
                count: project._count.favoritedBy,
                favorited: isFavorited,
              }}
              projectId={project.id}
              canFavorite={canFavorite}
            />
            {canManage && (
              <LinkButton
                href={`/influence/${project.key}/manage`}
                icon={faEdit}
                button={{ color: 'primary' }}
              >
                Manage
              </LinkButton>
            )}
          </div>
        }
      >
        <Link href={project.website} external>
          <h1>{project.name}</h1>
        </Link>
      </PageTitle>
      <GameLink
        className='self-start'
        gameKey={project.game.key}
        name={project.game.name}
        logoUrl={project.game.logoUrl}
      />
    </div>
  )
  const Actions = () => (
    <div className='flex flex-row items-center gap-x-5 gap-y-2 flex-wrap justify-center xs:justify-start'>
      <Link href={project.website} target='_blank'>
        <Button
          color='secondary'
          startIcon={<FontAwesomeIcon icon={faGlobe} />}
        >
          Website
        </Button>
      </Link>
      {project.donationAddress && (
        <DonationButton
          buttonProps={{ color: 'primary' }}
          targetAddress={project.donationAddress}
          modalTitle={`Donate to ${project.name}`}
          purposeText={<p>All donations go to 100% to the project.</p>}
        >
          Donate
        </DonationButton>
      )}
      <SocialLinks
        className='md:hidden flex flex-row gap-x-5 text-4xl'
        socials={project.socials}
        compact
      />
      <SocialLinks
        className='hidden md:flex flex-row gap-x-3 text-4xl'
        socials={project.socials}
      />
    </div>
  )

  return (
    <div className='flex flex-col gap-y-2'>
      <Head>
        <title>{project.name}</title>
      </Head>
      <Header />
      <Actions />
      <p className='text-lg'>{project.abstract}</p>
      {authors.length > 0 && (
        <h2>{authors.length > 1 ? 'Authors' : 'Author'}</h2>
      )}
      <div className='flex flex-row gap-3 flex-wrap'>
        {authors.map((author) => (
          <Link
            className='text-xl'
            key={author.id}
            href={`/users/${author.id}`}
            highlight
          >
            {author.name ?? author.address}
          </Link>
        ))}
      </div>
      {project.description && (
        <Markdown.Display className='mt-2'>
          {project.description}
        </Markdown.Display>
      )}
    </div>
  )
}

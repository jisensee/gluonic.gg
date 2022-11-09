import type { Game, Project, ProjectPost, Socials, User } from '@prisma/client'
import type { GetServerSideProps } from 'next'
import {
  faAdd,
  faEdit,
  faGlobe,
  faNewspaper,
} from '@fortawesome/free-solid-svg-icons'
import { Button, Divider } from 'react-daisyui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { Maybe } from 'purify-ts'
import Head from 'next/head'
import type { FC } from 'react'
import { useState } from 'react'
import classNames from 'classnames'
import { SocialLinks } from '@/components/social-links'
import { Markdown } from '@/components/markdown'
import { DonationButton } from '@/components/donation-button'
import { canUserManageProject, withOptionalUser } from '@/server/server-utils'
import { Link } from '@/components/link'
import { GameLink } from '@/components/common/game-link'
import { LinkButton } from '@/components/common/link-button'
import type { FavoriteState } from '@/hooks/favorite-hooks'
import { useFavoriteState } from '@/hooks/favorite-hooks'
import { FavoriteButton } from '@/components/favorite-button'
import { Post } from '@/components/project-post'
import { UserLink } from '@/components/user-link'
import { prisma } from '@/server/db/client'
import { trpc } from '@/utils/trpc'
import { ProjectHeader } from '@/components/project-header'

type Props = {
  project: Project & {
    _count: { favoritedBy: number }
    socials: Socials
    game: Game
  }
  posts: ProjectPost[]
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
    const project = await prisma.project.findFirst({
      where: { key: projectKey, game: { key: gameKey } },
      include: {
        _count: { select: { favoritedBy: true } },
        socials: true,
        game: true,
        posts: { take: 3, orderBy: [{ publishedAt: 'desc' }] },
        projectAuthorships: { include: { user: true } },
      },
    })

    if (!project || !(await projectVisible(project, maybeUser))) {
      return Promise.resolve({ notFound: true })
    }

    const user = maybeUser.extract()
    const isFavorited = user
      ? await prisma.user
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
        posts: project.posts,
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
  const { mutateAsync } = trpc.project.toggleFavorite.useMutation()
  const [serverFavorited, setServerFavorited] = useState(favorited)
  const { localFavoriteState, toggleFavorite } = useFavoriteState(
    {
      favorited: serverFavorited,
      count,
    },
    canFavorite
      ? () => mutateAsync({ projectId: projectId }).then(setServerFavorited)
      : undefined
  )

  return <FavoriteButton state={localFavoriteState} onToggle={toggleFavorite} />
}

export default function ProjectPage({
  project,
  authors,
  posts,
  canManage,
  isFavorited,
  canFavorite,
}: Props) {
  const header = (
    <div className='flex flex-col gap-y-2'>
      <div className='flex flex-row flex-wrap justify-between gap-3'>
        <ProjectHeader project={project} />
        <div className='flex flex-row items-center gap-x-8'>
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
      </div>
      <GameLink
        className='self-start'
        gameKey={project.game.key}
        name={project.game.name}
        logoUrl={project.game.logoUrl}
      />
    </div>
  )
  const actions = (
    <div className='flex flex-row flex-wrap items-center justify-center gap-x-5 gap-y-2 xs:justify-start'>
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
        className='flex flex-row gap-x-5 text-4xl md:hidden'
        socials={project.socials}
        compact
      />
      <SocialLinks
        className='hidden flex-row gap-x-3 text-4xl md:flex'
        socials={project.socials}
      />
    </div>
  )
  const projectUrl = `/${project.game.key}/${project.key}`
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)
  const description = project.description && (
    <div className='flex grow flex-col gap-y-3'>
      <h2>Description</h2>
      <Markdown.Display
        className={classNames({
          'max-md:max-h-40 max-md:overflow-hidden': !descriptionExpanded,
        })}
      >
        {project.description}
      </Markdown.Display>
      <Button
        className='md:hidden'
        color='ghost'
        onClick={() => setDescriptionExpanded((e) => !e)}
      >
        {descriptionExpanded ? 'Show less' : 'Show more'}
      </Button>
    </div>
  )
  const projectPosts = (
    <>
      <h2>Posts</h2>
      {posts.map((post) => (
        <Link href={`${projectUrl}/posts/${post.id}`} key={post.id}>
          <Post.Preview
            title={post.title}
            abstract={post.abstract}
            publishedAt={post.publishedAt}
            shortAbstract
          />
        </Link>
      ))}
      {posts.length > 0 ? (
        <Link href={`${projectUrl}/posts`}>
          <Button
            color='primary'
            fullWidth
            startIcon={<FontAwesomeIcon icon={faNewspaper} />}
          >
            All posts
          </Button>
        </Link>
      ) : (
        <span>No posts yet</span>
      )}
      {canManage && (
        <Link href={`${projectUrl}/posts/new`}>
          <Button
            color='secondary'
            fullWidth
            startIcon={<FontAwesomeIcon icon={faAdd} />}
          >
            New post
          </Button>
        </Link>
      )}
    </>
  )

  return (
    <div className='flex flex-col gap-y-2'>
      <Head>
        <title>{project.name}</title>
      </Head>
      {header}
      {actions}
      <p className='text-lg'>{project.abstract}</p>
      {authors.length > 0 && (
        <h2>{authors.length > 1 ? 'Authors' : 'Author'}</h2>
      )}
      <div className='flex flex-row flex-wrap gap-3'>
        {authors.map((author) => (
          <UserLink key={author.id} id={author.id} name={author.name} />
        ))}
      </div>
      <Divider />
      <div className='flex flex-col gap-3 md:flex-row'>
        {description}
        {description && (
          <>
            <div className='divider divider-horizontal max-md:hidden' />
            <Divider className='md:hidden' />
          </>
        )}
        <div className='flex flex-col gap-y-3 md:w-1/3'>{projectPosts}</div>
      </div>
    </div>
  )
}

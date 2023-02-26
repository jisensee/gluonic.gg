import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { notFound } from 'next/navigation'
import { Metadata } from 'next/types'
import { prisma } from '@/server/db/client'
import { ProjectHeader } from '@/components/project-header'
import { LinkButton } from '@/components/common/link-button'
import { Link } from '@/components/link'
import { PostPreview } from '@/components/post-preview'
import { canUserManageProject, getUser } from '@/server/server-utils'
import { NextPage } from '@/utils/next-types'

// const getProject = cache((gameKey: string, projectKey: string) =>
const getProject = (gameKey: string, projectKey: string) =>
  prisma.project.findFirst({
    where: {
      key: projectKey,
      game: {
        key: gameKey,
      },
    },
    include: {
      game: true,
      posts: {
        orderBy: {
          publishedAt: 'desc',
        },
      },
    },
  })

type Params = {
  game: string
  project: string
}

export const metadata: Metadata = {
  title: 'Posts',
}

const ProjectPostsPage: NextPage<Params> = async ({ params }) => {
  const user = await getUser()
  const project = await getProject(params.game, params.project)
  if (!project) {
    notFound()
  }

  const canManage =
    (user && (await canUserManageProject(project, user))) ?? false

  const projectUrl = `/${project.game.key}/${project.key}`
  const writePostButton = (className: string) =>
    canManage && (
      <LinkButton
        className={className}
        href={`${projectUrl}/posts/new`}
        button={{ color: 'primary', fullWidth: true }}
        icon={faAdd}
      >
        Write Post
      </LinkButton>
    )
  return (
    <div className='flex flex-col gap-y-3'>
      <div className='flex w-full flex-row justify-between'>
        <ProjectHeader project={project} data-superjson />
        {writePostButton('max-md:hidden')}
      </div>
      {writePostButton('md:hidden')}
      {project.posts.map((post) => (
        <Link href={`${projectUrl}/posts/${post.id}`} key={post.id}>
          <PostPreview
            title={post.title}
            abstract={post.abstract}
            publishedAt={post.publishedAt.toISOString()}
          />
        </Link>
      ))}
      {project.posts.length === 0 && <span>No posts yet</span>}
    </div>
  )
}
export default ProjectPostsPage

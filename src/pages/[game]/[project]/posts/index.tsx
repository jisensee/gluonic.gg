import { Game, Project, ProjectPost } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { Button } from 'react-daisyui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { prisma } from '@/server/db/client'
import { Link } from '@/components/link'
import { Post } from '@/components/project-post'
import { ProjectHeader } from '@/components/project-header'

type Props = {
  project: Project & {
    posts: ProjectPost[]
    game: Game
  }
}
export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const projectKey = context.query['project'] as string
  const project = await prisma.project.findUnique({
    where: {
      key: projectKey,
    },
    include: {
      posts: {
        orderBy: {
          publishedAt: 'desc',
        },
      },
      game: true,
    },
  })

  if (!project) {
    return { notFound: true }
  }
  return { props: { project } }
}

export default function ProjectPostsPage({ project }: Props) {
  const projectUrl = `/${project.game.key}/${project.key}`
  const writePostButton = (className: string) => (
    <Link href={`${projectUrl}/posts/new`} className={className}>
      <Button
        color='primary'
        startIcon={<FontAwesomeIcon icon={faAdd} />}
        fullWidth
      >
        Write post
      </Button>
    </Link>
  )
  return (
    <div className='flex flex-col gap-y-3'>
      <div className='flex flex-row justify-between w-full'>
        <ProjectHeader project={project} />
        {writePostButton('max-md:hidden')}
      </div>
      {writePostButton('md:hidden')}
      {project.posts.map((post) => (
        <Link href={`${projectUrl}/posts/${post.id}`} key={post.id}>
          <Post.Preview
            title={post.title}
            abstract={post.abstract}
            publishedAt={post.publishedAt}
          />
        </Link>
      ))}
      {project.posts.length === 0 && <span>No posts yet</span>}
    </div>
  )
}

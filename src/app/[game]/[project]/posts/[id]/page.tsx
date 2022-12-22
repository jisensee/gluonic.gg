import { notFound } from 'next/navigation'
import { cache } from 'react'
import { Sidebar } from './sidebar'
import { MainPost } from './main-post'
import { canUserManageProject, getUser } from '@/server/server-utils'
import { prisma } from '@/server/db/client'
import { GenerateMetadata, NextPage } from '@/utils/next-types'

type Params = {
  id: string
}

const getPost = cache((id: string) =>
  prisma.projectPost.findUnique({
    where: { id },
    include: { author: true, project: { include: { game: true } } },
  })
)

export const generateMetadata: GenerateMetadata<Params> = async ({
  params,
}) => {
  const post = await getPost(params.id)
  if (!post) {
    notFound()
  }

  return {
    title: post.title,
  }
}

const ProjectPostPage: NextPage<Params> = async ({ params }) => {
  const user = await getUser()
  const post = await getPost(params.id)
  if (!post) {
    notFound()
  }
  const otherPosts = await prisma.projectPost.findMany({
    where: {
      id: {
        not: params.id,
      },
      projectId: post.projectId,
    },
    orderBy: [
      {
        publishedAt: 'desc',
      },
    ],
    take: 3,
  })
  const canManage =
    user !== undefined &&
    post.authorId === user.id &&
    (await canUserManageProject(post.project, user))

  const gameKey = post.project.game.key
  const projectKey = post.project.key
  const projectUrl = `/${gameKey}/${projectKey}`

  const sidebar =
    otherPosts.length > 0 ? (
      <Sidebar
        projectUrl={projectUrl}
        posts={otherPosts.map((p) => ({
          id: p.id,
          title: p.title,
          abstract: p.abstract,
          publishedAt: p.publishedAt.toISOString(),
        }))}
      />
    ) : null
  return (
    <div className='flex flex-col gap-3 md:flex-row'>
      <MainPost
        projectUrl={projectUrl}
        publishedAt={post.publishedAt.toISOString()}
        post={{
          abstract: post.abstract,
          title: post.title,
          body: post.body,
        }}
        authorId={post.authorId}
        authorName={post.author.name ?? undefined}
        postId={post.id}
        canManage={canManage}
        project={post.project}
      />
      {otherPosts.length > 0 && (
        <>
          <div className='divider md:hidden' />
          <div className='divider divider-horizontal max-md:hidden' />
        </>
      )}
      {sidebar}
    </div>
  )
}
export default ProjectPostPage

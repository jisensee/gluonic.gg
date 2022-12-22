import { notFound } from 'next/navigation'
import { Metadata } from 'next/types'
import { EditPostForm } from './form'
import { prisma } from '@/server/db/client'
import { canUserManageProject, getUser } from '@/server/server-utils'

type Params = {
  id: string
}

export const metadata: Metadata = {
  title: 'Edit Post',
}

export default async function EditPostPage({ params }: { params: Params }) {
  const user = await getUser()
  if (!user) {
    notFound()
  }

  const post = await prisma.projectPost.findUnique({
    where: { id: params.id },
    include: { project: { include: { game: true } } },
  })
  if (!post || !canUserManageProject(post.project, user)) {
    notFound()
  }
  const projectUrl = `/${post.project.game.key}/${post.project.key}`

  return (
    <>
      <h1>Edit your post</h1>
      <EditPostForm
        postId={post.id}
        projectUrl={projectUrl}
        initialData={{
          title: post.title,
          abstract: post.abstract,
          body: post.body,
        }}
      />
    </>
  )
}

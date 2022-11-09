import { Game, Project, ProjectPost } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { z } from 'zod'
import { useRouter } from 'next/router'
import { prisma } from '@/server/db/client'
import { trpc } from '@/utils/trpc'
import { postDataInput } from '@/utils/trpc-inputs'
import { PostForm } from '@/components/post-form'
import { canUserManageProject, withUser } from '@/server/server-utils'
import { mutationToToastStatus, useStatusToast } from '@/context/toast-context'

type Props = {
  post: ProjectPost & { project: Project & { game: Game } }
}
export const getServerSideProps: GetServerSideProps<Props> = async (context) =>
  withUser(context, async (user) => {
    const id = context.query['id'] as string
    const post = await prisma.projectPost.findUnique({
      where: { id },
      include: { project: { include: { game: true } } },
    })
    if (!post || !canUserManageProject(post.project, user)) {
      return Promise.resolve({ notFound: true })
    }

    return { props: { post } }
  })

type FormData = z.infer<typeof postDataInput>

export default function EditPostPage({ post }: Props) {
  const { mutateAsync, isLoading, status, error } = trpc.post.edit.useMutation()
  const { push } = useRouter()

  useStatusToast(mutationToToastStatus(status), {
    success: {
      title: 'Post has been successfully edited!',
    },
    error: {
      title: 'Error when trying to edit post!',
      message: error?.message,
    },
  })
  const projectUrl = `/${post.project.game.key}/${post.project.key}`
  const onSubmit = (d: FormData) =>
    mutateAsync({
      post: d,
      postId: post.id,
    }).then((updated) => push(`${projectUrl}/posts/${updated.id}`))

  return (
    <>
      <h1>Edit your post</h1>

      <PostForm
        initialData={{
          title: post.title,
          abstract: post.abstract,
          body: post.body,
        }}
        onSubmit={onSubmit}
        isLoading={isLoading}
        saveText='Save'
      />
    </>
  )
}

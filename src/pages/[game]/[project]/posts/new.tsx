import { Game, Project } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { z } from 'zod'
import { useRouter } from 'next/router'
import { prisma } from '@/server/db/client'
import { trpc } from '@/utils/trpc'
import { postDataInput } from '@/utils/trpc-inputs'
import { PostForm } from '@/components/post-form'
import { mutationToToastStatus, useStatusToast } from '@/context/toast-context'

type Props = {
  project: Project & { game: Game }
}
export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const projectKey = context.query['project'] as string

  const project = await prisma.project.findUnique({
    where: { key: projectKey },
    include: { game: true },
  })

  return project ? { props: { project } } : { notFound: true }
}

type FormData = z.infer<typeof postDataInput>

export default function NewPostPage({ project }: Props) {
  const { mutateAsync, isLoading, status, error } =
    trpc.post.create.useMutation()
  const { push } = useRouter()
  const projectUrl = `/${project.game.key}/${project.key}`

  useStatusToast(mutationToToastStatus(status), {
    success: {
      title: 'Your post has been published!',
    },
    error: {
      title: 'Error when trying to publish post!',
      message: error?.message,
    },
  })

  const onSubmit = (d: FormData) =>
    mutateAsync({
      post: d,
      projectId: project.id,
    }).then((created) => push(`${projectUrl}/posts/${created.id}`))
  return (
    <>
      <h1>Write new post for {project.name}</h1>

      <PostForm onSubmit={onSubmit} isLoading={isLoading} saveText='Publish' />
    </>
  )
}

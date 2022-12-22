'use client'

import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import { trpc } from '@/utils/trpc'
import { postDataInput } from '@/utils/trpc-inputs'
import { PostForm } from '@/components/post-form'
import { mutationToToastStatus, useStatusToast } from '@/context/toast-context'

type NewPostFormProps = { projectId: string; projectUrl: string }

type FormData = z.infer<typeof postDataInput>

export const NewPostForm: FC<NewPostFormProps> = ({
  projectId,
  projectUrl,
}: NewPostFormProps) => {
  const { mutateAsync, isLoading, status, error } =
    trpc.post.create.useMutation()

  const { push } = useRouter()

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
      projectId,
    }).then((created) => push(`${projectUrl}/posts/${created.id}`))

  return (
    <PostForm onSubmit={onSubmit} isLoading={isLoading} saveText='Publish' />
  )
}

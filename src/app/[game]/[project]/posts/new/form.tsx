'use client'

import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import { Route } from 'next'
import { trpc } from '@/utils/trpc'
import { postDataInput } from '@/utils/trpc-inputs'
import { PostForm } from '@/components/post-form'
import { mutationToToastStatus, useStatusToast } from '@/context/toast-context'

type NewPostFormProps = {
  projectId: string
  projectUrl: string
  subscriberCount: number
}

type FormData = z.infer<typeof postDataInput>

export const NewPostForm: FC<NewPostFormProps> = ({
  projectId,
  projectUrl,
  subscriberCount,
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
    }).then((created) => push(`${projectUrl}/posts/${created.id}` as Route))

  return (
    <PostForm
      onSubmit={onSubmit}
      isLoading={isLoading}
      saveText={
        subscriberCount > 0
          ? `Publish to ${subscriberCount} subscribers`
          : 'Publish'
      }
    />
  )
}

'use client'

import { FC } from 'react'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Route } from 'next'
import { trpc } from '@/utils/trpc'
import { postDataInput } from '@/utils/trpc-inputs'
import { PostForm } from '@/components/post-form'
import { mutationToToastStatus, useStatusToast } from '@/context/toast-context'

type FormData = z.infer<typeof postDataInput>

type EditFormProps = {
  postId: string
  projectUrl: string
  initialData: FormData
}

export const EditPostForm: FC<EditFormProps> = ({
  postId,
  projectUrl,
  initialData,
}: EditFormProps) => {
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
  const onSubmit = (d: FormData) =>
    mutateAsync({
      post: d,
      postId,
    }).then((updated) => push(`${projectUrl}/posts/${updated.id}` as Route))

  return (
    <PostForm
      initialData={initialData}
      onSubmit={onSubmit}
      isLoading={isLoading}
      saveText='Save'
    />
  )
}

'use client'

import {
  faEdit,
  faEllipsisVertical,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Game, Project } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import { Route } from 'next'
import { Dropdown } from '@/components/common/dropdown'
import { ConfirmModal } from '@/components/common/modal'
import { ProjectHeader } from '@/components/project-header'
import { UserLink } from '@/components/user-link'
import { mutationToToastStatus, useStatusToast } from '@/context/toast-context'
import { trpc } from '@/utils/trpc'
import { PostDisplay } from '@/components/post-display'

type MainPostProps = {
  canManage: boolean
  publishedAt: string
  postId: string
  authorId: string
  authorName?: string
  projectUrl: string
  project: Project & { game: Game }
  post: { title: string; body: string; abstract: string }
}
export const MainPost: FC<MainPostProps> = ({
  canManage,
  publishedAt,
  postId,
  authorId,
  authorName,
  projectUrl,
  project,
  post,
}: MainPostProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const {
    mutateAsync: deletePost,
    status,
    error,
  } = trpc.post.delete.useMutation()
  const router = useRouter()

  useStatusToast(mutationToToastStatus(status), {
    success: {
      title: 'Post has been successfully deleted!',
    },
    error: {
      title: 'Error when trying to delete post!',
      message: error?.message,
    },
  })

  const onDelete = () => {
    deletePost({ postId }).then(() =>
      router.push(`${projectUrl}/posts` as Route)
    )
  }

  const deleteModal = (
    <ConfirmModal
      open={deleteModalOpen}
      onClose={() => setDeleteModalOpen(false)}
      title='Really delete this post?'
      onConfirm={onDelete}
      confirmLabel='Yes, delete post'
    >
      This can&apos;t be undone. It will be like you never wrote it.
    </ConfirmModal>
  )

  const mainPost = (
    <div className='flex grow flex-col gap-y-2'>
      <div className='flex flex-row justify-between gap-x-3'>
        <ProjectHeader project={project} />
        {canManage && (
          <Dropdown
            toggle={<FontAwesomeIcon icon={faEllipsisVertical} size='2x' />}
            items={[
              {
                text: 'Edit',
                icon: faEdit,
                href: `${projectUrl}/posts/${postId}/edit`,
              },
              {
                text: 'Delete',
                icon: faTrash,
                onClick: () => setDeleteModalOpen(true),
              },
            ]}
          />
        )}
      </div>
      <span>
        <span className='italic'>
          Published at {new Date(publishedAt).toLocaleDateString()} by{' '}
        </span>
        <UserLink id={authorId} name={authorName} />
      </span>
      <PostDisplay
        title={post.title}
        abstract={post.abstract}
        body={post.body}
      />
    </div>
  )
  return (
    <>
      {deleteModal}
      {mainPost}
    </>
  )
}

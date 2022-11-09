import { Game, Project, ProjectPost, User } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { Button, Divider } from 'react-daisyui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
  faEllipsisVertical,
  faNewspaper,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { canUserManageProject, withUser } from '@/server/server-utils'
import { prisma } from '@/server/db/client'
import { UserLink } from '@/components/user-link'
import { Post } from '@/components/project-post'
import { Link } from '@/components/link'
import { Dropdown } from '@/components/common/dropdown'
import { trpc } from '@/utils/trpc'
import { ConfirmModal } from '@/components/common/modal'
import { ProjectHeader } from '@/components/project-header'
import { mutationToToastStatus, useStatusToast } from '@/context/toast-context'

type Props = {
  post: ProjectPost & {
    author: User
    project: Project & { game: Game }
  }
  canManage: boolean
  otherPosts: ProjectPost[]
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) =>
  withUser(context, async (user) => {
    const id = context.query['id'] as string
    const post = await prisma.projectPost.findUnique({
      where: { id },
      include: { author: true, project: { include: { game: true } } },
    })
    if (!post) {
      return Promise.resolve({ notFound: true })
    }
    const otherPosts = await prisma.projectPost.findMany({
      where: {
        id: {
          not: id,
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
      post.authorId === user.id &&
      (await canUserManageProject(post.project, user))

    return { props: { post, otherPosts, canManage } }
  })

export default function ProjectPostPage({ post, otherPosts }: Props) {
  const gameKey = post.project.game.key
  const projectKey = post.project.key
  const projectUrl = `/${gameKey}/${projectKey}`
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const {
    mutateAsync: deletePost,
    status,
    error,
  } = trpc.post.delete.useMutation()
  const { push } = useRouter()

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
    deletePost({ postId: post.id }).then(() => push(`${projectUrl}/posts`))
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
      <div className='flex flex-row gap-x-3 justify-between'>
        <ProjectHeader project={post.project} />
        <Dropdown
          toggle={<FontAwesomeIcon icon={faEllipsisVertical} size='2x' />}
          items={[
            {
              text: 'Edit',
              icon: faEdit,
              href: `${projectUrl}/posts/${post.id}/edit`,
            },
            {
              text: 'Delete',
              icon: faTrash,
              onClick: () => setDeleteModalOpen(true),
            },
          ]}
        />
      </div>
      <span>
        <span className='italic'>
          Published at {post.publishedAt.toLocaleDateString()} by{' '}
        </span>
        <UserLink id={post.author.id} name={post.author.name} />
      </span>
      <Post.Display
        title={post.title}
        abstract={post.abstract}
        body={post.body}
      />
    </div>
  )
  const sidebar =
    otherPosts.length > 0 ? (
      <div className='flex flex-col gap-y-3 md:w-1/3'>
        <h3>Other posts</h3>
        {otherPosts.map((post) => (
          <Link key={post.id} href={`${projectUrl}/posts/${post.id}`}>
            <Post.Preview
              title={post.title}
              abstract={post.abstract}
              publishedAt={post.publishedAt}
              shortAbstract
            />
          </Link>
        ))}
        <Link href={`${projectUrl}/posts`}>
          <Button
            fullWidth
            color='primary'
            startIcon={<FontAwesomeIcon icon={faNewspaper} />}
          >
            All posts
          </Button>
        </Link>
      </div>
    ) : null
  return (
    <div className='flex flex-col gap-3 md:flex-row'>
      {deleteModal}
      {mainPost}
      {otherPosts.length > 0 && (
        <>
          <Divider className='md:hidden' />
          <div className='divider divider-horizontal max-md:hidden' />
        </>
      )}
      {sidebar}
    </div>
  )
}

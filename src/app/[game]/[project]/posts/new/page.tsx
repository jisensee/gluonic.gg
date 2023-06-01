import { notFound } from 'next/navigation'
import { Metadata } from 'next/types'
import { NewPostForm } from './form'
import { prisma } from '@/server/db/client'
import { getUser } from '@/server/server-utils'
import { NextPage } from '@/utils/next-types'

type Params = {
  game: string
  project: string
}

export const metadata: Metadata = {
  title: 'New post',
}

const NewPostPage: NextPage<Params> = async ({ params }) => {
  const user = await getUser()
  if (!user) {
    notFound()
  }

  const project = await prisma.project.findFirst({
    where: { key: params.project, game: { key: params.game } },
    include: {
      game: true,
      _count: {
        select: {
          subscriptions: true,
        },
      },
    },
  })
  if (!project) {
    notFound()
  }

  const projectUrl = `/${project.game.key}/${project.key}`

  return (
    <>
      <h1>Write new post for {project.name}</h1>
      <NewPostForm
        projectUrl={projectUrl}
        projectId={project.id}
        subscriberCount={project._count.subscriptions}
      />
    </>
  )
}

export default NewPostPage

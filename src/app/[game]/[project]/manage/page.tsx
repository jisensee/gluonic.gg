import { notFound } from 'next/navigation'
import { Metadata } from 'next/types'
import { ManageProjectTabs } from './tabs'
import { canUserManageProject, getUser } from '@/server/server-utils'

import { PageTitle } from '@/components/common/page-title'
import { LinkButton } from '@/components/common/link-button'
import { prisma } from '@/server/db/client'

export type Params = {
  game: string
  project: string
}

// const getProject = cache((gameKey: string, projectKey: string) =>
const getProject = (gameKey: string, projectKey: string) =>
  prisma.project.findFirst({
    where: { key: projectKey, game: { key: gameKey } },
    include: { game: true, socials: true },
  })

export const metadata: Metadata = {
  title: 'Manage',
}

export default async function ManageProjectPage({
  params,
}: {
  params: Params
}) {
  const user = await getUser()
  if (!user) {
    notFound()
  }
  const project = await getProject(params.game, params.project)

  if (!project || !(await canUserManageProject(project, user))) {
    notFound()
  }

  return (
    <div className='flex flex-col gap-y-3'>
      <PageTitle
        rightElement={
          <LinkButton
            href={`/${project.game.key}/${project.key}`}
            button={{ color: 'primary' }}
          >
            View project
          </LinkButton>
        }
      >
        Manage {project.name}
      </PageTitle>
      <ManageProjectTabs
        projectId={project.id}
        logoUrl={project.logoUrl ?? project.game.logoUrl}
        initialData={{
          projectId: project.id,
          abstract: project.abstract,
          website: project.website,
          description: project.description ?? '',
          published: project.published,
          donationAddress: project.donationAddress ?? '',
          socials: {
            discord: project.socials.discord ?? '',
            github: project.socials.github ?? '',
            twitter: project.socials.twitter ?? '',
          },
        }}
      />
    </div>
  )
}

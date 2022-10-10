import { Game, Project, Socials } from '@prisma/client'
import { GetServerSideProps, GetServerSidePropsResult } from 'next'
import { Tabs } from 'react-daisyui'
import { useState } from 'react'

import Head from 'next/head'
import { canUserManageProject, withUser } from '@/server/server-utils'
import { db } from '@/server/db'

import { ProjectBaseDataForm } from '@/components/manage-project-page/project-base-data-form'
import { ProjectSocialsForm } from '@/components/manage-project-page/project-socials-form'
import { ProjectDonationsForm } from '@/components/manage-project-page/project-donations-form'
import { PageTitle } from '@/components/common/page-title'
import { LinkButton } from '@/components/common/link-button'
import { ProjectImagesForm } from '@/components/manage-project-page/project-images-form'

type Props = {
  project: Project & {
    socials: Socials
    game: Game
  }
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) =>
  withUser(context, async (user) => {
    const key = context.query['project'] as string

    const project = await db.project.findUnique({
      where: { key },
      include: { game: true, socials: true },
    })

    if (project && user && (await canUserManageProject(project, user))) {
      return {
        props: { project, socials: project.socials },
      } as GetServerSidePropsResult<Props>
    }
    return { notFound: true }
  })

type ActiveTab = 'data' | 'socials' | 'donations' | 'images'

export default function ManageProjectPage({ project }: Props) {
  const [tab, setTab] = useState<ActiveTab>('data')

  return (
    <div className='flex flex-col gap-y-3'>
      <Head>
        <title>Manage {project.name}</title>
      </Head>
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
      <Tabs value={tab} onChange={setTab} size='lg' boxed color='primary'>
        <Tabs.Tab value='data'>Data</Tabs.Tab>
        <Tabs.Tab value='socials'>Socials</Tabs.Tab>
        <Tabs.Tab value='images'>Images</Tabs.Tab>
        <Tabs.Tab value='donations'>Donations</Tabs.Tab>
      </Tabs>
      <ProjectBaseDataForm
        className={tab === 'data' ? 'flex' : 'hidden'}
        projectId={project.id}
        initialData={{
          abstract: project.abstract,
          website: project.website,
          description: project.description ?? '',
          published: project.published,
        }}
      />
      <ProjectSocialsForm
        className={tab === 'socials' ? 'flex' : 'hidden'}
        projectId={project.id}
        initialData={{
          discord: project.socials.discord ?? '',
          github: project.socials.github ?? '',
          twitter: project.socials.twitter ?? '',
        }}
      />
      <ProjectImagesForm
        className={tab === 'images' ? 'flex' : 'hidden'}
        projectId={project.id}
        initialData={{ logoUrl: project.logoUrl ?? project.game.logoUrl }}
      />
      <ProjectDonationsForm
        className={tab === 'donations' ? 'flex' : 'hidden'}
        projectId={project.id}
        initialData={{ donationAddress: project.donationAddress }}
      />
    </div>
  )
}

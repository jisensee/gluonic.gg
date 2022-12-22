'use client'
import { Tabs } from 'react-daisyui'

import { z } from 'zod'
import { FC, useState } from 'react'

import { ProjectDonationsForm } from './project-donations-form'
import { ProjectImagesForm } from './project-images-form'
import { ProjectSocialsForm } from './project-socials-form'
import { ProjectBaseDataForm } from './project-base-data-form'
import { ProjectRouterInputs } from '@/utils/trpc-inputs'

type UpdateData = z.infer<typeof ProjectRouterInputs.update>

type ActiveTab = 'data' | 'socials' | 'donations' | 'images'

type ManageProjectTabsProps = {
  initialData: UpdateData
  logoUrl: string
  projectId: string
}

export const ManageProjectTabs: FC<ManageProjectTabsProps> = ({
  initialData,
  logoUrl,
  projectId,
}: ManageProjectTabsProps) => {
  const [tab, setTab] = useState<ActiveTab>('data')
  return (
    <>
      <Tabs value={tab} onChange={setTab} size='lg' boxed color='primary'>
        <Tabs.Tab value='data'>Data</Tabs.Tab>
        <Tabs.Tab value='socials'>Socials</Tabs.Tab>
        <Tabs.Tab value='images'>Images</Tabs.Tab>
        <Tabs.Tab value='donations'>Donations</Tabs.Tab>
      </Tabs>
      <ProjectBaseDataForm
        className={tab === 'data' ? 'flex' : 'hidden'}
        initialData={initialData}
      />
      <ProjectSocialsForm
        className={tab === 'socials' ? 'flex' : 'hidden'}
        initialData={initialData}
      />
      <ProjectImagesForm
        className={tab === 'images' ? 'flex' : 'hidden'}
        projectId={projectId}
        initialData={{ logoUrl }}
      />
      <ProjectDonationsForm
        className={tab === 'donations' ? 'flex' : 'hidden'}
        initialData={initialData}
      />
    </>
  )
}

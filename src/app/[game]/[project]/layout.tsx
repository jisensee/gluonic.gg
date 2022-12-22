import type { Metadata } from 'next/types'
import { notFound } from 'next/navigation'
import { PropsWithChildren } from 'react'
import { getProject, Params } from './data'

export const generateMetadata = async ({
  params,
}: {
  params: Params
}): Promise<Metadata> => {
  const project = await getProject(params.game, params.project)
  if (!project) {
    notFound()
  }
  return {
    title: {
      default: project.name,
      template: ` ${project.name} | %s | Gluonic`,
    },
  }
}

export default function Layout({ children }: PropsWithChildren) {
  return children
}

'use client'

import Image from 'next/image'
import { Game, Project } from '@prisma/client'
import { FC } from 'react'
import { Link } from './link'

type ProjectHeaderProps = {
  project: Project & { game: Game }
}
export const ProjectHeader: FC<ProjectHeaderProps> = ({ project }) => {
  const projectUrl = `/${project.game.key}/${project.key}`
  return (
    <Link className='flex flex-row items-center gap-x-5' href={projectUrl}>
      <div className='relative h-16 w-16'>
        <Image
          className='object-contain'
          src={project.logoUrl ?? project.game.logoUrl}
          alt={`${project.name} logo`}
          fill
        />
      </div>
      <h1>{project.name}</h1>
    </Link>
  )
}

'use client'

import { Game } from '@prisma/client'
import { Card } from 'react-daisyui'
import { FC, PropsWithChildren } from 'react'
import { GameLink } from '@/components/common/game-link'

type ProjectCardProps = {
  name: string
  game: Game
  abstract: string
} & PropsWithChildren

export const ProjectCard: FC<ProjectCardProps> = ({
  name,
  game,
  abstract,
  children,
}) => (
  <Card className='flex flex-row flex-wrap items-center justify-center gap-x-5 gap-y-3 border-primary py-3 px-5 md:justify-start'>
    <div className='flex flex-col gap-y-1'>
      <h2>{name}</h2>
      <GameLink gameKey={game.key} name={game.name} logoUrl={game.logoUrl} />
    </div>
    <div className='hidden md:flex'>{abstract}</div>
    <div className='grow' />
    {children}
  </Card>
)

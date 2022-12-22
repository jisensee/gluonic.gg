'use client'

import { Game, ProjectRequest, User } from '@prisma/client'
import { Button, Card, Input } from 'react-daisyui'
import { FC, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { GameLink } from '@/components/common/game-link'
import { Link } from '@/components/link'
import { Format } from '@/format'

type ProjectCardProps = {
  request: ProjectRequest
  game: Game
  user: User
  loading: boolean
  onAccept: (key: string) => void
  onReject: () => void
}

export const ProjectCard: FC<ProjectCardProps> = ({
  request,
  game,
  user,
  loading,
  onAccept,
  onReject,
}) => {
  const [key, setKey] = useState('')
  return (
    <Card className='flex flex-row flex-wrap items-center justify-center gap-x-5 gap-y-3 border-primary py-3 px-5 md:justify-start'>
      <div className='flex flex-col gap-y-1'>
        <h2>{request.projectName}</h2>
        <GameLink gameKey={game.key} name={game.name} logoUrl={game.logoUrl} />
        <span>
          From{' '}
          <Link href={`/users/${user.id}`} highlight>
            {Format.username(user.name)}
          </Link>
        </span>
        <Link href={request.projectWebsite} external highlight>
          {request.projectWebsite}
        </Link>
      </div>
      <div className='hidden md:flex'>{request.projectAbstract}</div>
      <div className='grow' />
      <div className='flex flex-row items-center gap-x-3'>
        <label className='font-bold'>Project key:</label>
        <Input value={key} onChange={(e) => setKey(e.target.value)} />
      </div>
      <Button
        startIcon={<FontAwesomeIcon icon={faCheck} />}
        color='success'
        disabled={key.length === 0 || loading}
        onClick={() => onAccept(key)}
      >
        Accept
      </Button>
      <Button
        color='error'
        disabled={loading}
        onClick={onReject}
        startIcon={<FontAwesomeIcon icon={faTimes} />}
      >
        Reject
      </Button>
    </Card>
  )
}

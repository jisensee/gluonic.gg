import { Game, ProjectRequest, User } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { Button, Card, Input } from 'react-daisyui'
import { FC, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import Head from 'next/head'
import { withUser } from '@/server/server-utils'
import { prisma } from '@/server/db/client'
import { GameLink } from '@/components/common/game-link'
import { useToast } from '@/context/toast-context'
import { Link } from '@/components/link'
import { Format } from '@/format'
import { trpc } from '@/utils/trpc'

type Props = {
  projectRequests: (ProjectRequest & { game: Game; user: User })[]
}

export const getServerSideProps: GetServerSideProps<Props> = (context) =>
  withUser(context, async (user) => {
    if (user.role !== 'ADMIN') {
      return Promise.resolve({ notFound: true })
    }

    const projectRequests = await prisma.projectRequest.findMany({
      where: {
        rejected: false,
      },
      orderBy: { requestedAt: 'asc' },
      include: { game: true, user: true },
    })

    return { props: { projectRequests } }
  })

type ProjectCardProps = {
  request: ProjectRequest
  game: Game
  user: User
  loading: boolean
  onAccept: (key: string) => void
  onReject: () => void
}
const ProjectCard: FC<ProjectCardProps> = ({
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

export default function ProjectRequestsPage({ projectRequests }: Props) {
  const { mutate, isLoading } = trpc.project.processRequest.useMutation()
  const [requests, setRequests] = useState(projectRequests)
  const { showToast } = useToast()

  const removeRequest = (id: string) =>
    setRequests((current) => current.filter((request) => request.id !== id))

  const onAccept = (request: ProjectRequest, key: string) =>
    mutate(
      { isAccepted: true, requestId: request.id, projectKey: key },
      {
        onSuccess: () => {
          removeRequest(request.id)
          showToast({
            status: 'success',
            title: `${request.projectName} has been accepted!`,
          })
        },
      }
    )

  const onReject = (request: ProjectRequest) =>
    mutate(
      { requestId: request.id, isAccepted: false },
      {
        onSuccess: () => {
          removeRequest(request.id)
          showToast({
            status: 'success',
            title: `${request.projectName} has been rejected!`,
          })
        },
      }
    )

  return (
    <div className='flex flex-col gap-y-3'>
      <Head>
        <title>Project requests</title>
      </Head>
      <h1>Pending project requests</h1>
      {requests.length === 0 && <p>No requests at this time</p>}
      {requests.map((request) => (
        <ProjectCard
          key={request.id}
          request={request}
          game={request.game}
          user={request.user}
          loading={isLoading}
          onAccept={(key) => onAccept(request, key)}
          onReject={() => onReject(request)}
        />
      ))}
    </div>
  )
}

import { Game, Project, ProjectRequest } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { Card } from 'react-daisyui'
import {
  faAdd,
  faClockRotateLeft,
  faEdit,
  faMagnifyingGlass,
  faTimes,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import Head from 'next/head'
import { FC, PropsWithChildren } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { withUser } from '@/server/server-utils'
import { prisma } from '@/server/db/client'
import { LinkButton } from '@/components/common/link-button'
import { GameLink } from '@/components/common/game-link'
import { PageTitle } from '@/components/common/page-title'

type ProjectCardProps = {
  name: string
  game: Game
  abstract: string
} & PropsWithChildren
const ProjectCard: FC<ProjectCardProps> = ({
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

type Props = {
  projects: (Project & { game: Game })[]
  projectRequests: (ProjectRequest & { game: Game })[]
}

export const getServerSideProps: GetServerSideProps<Props> = (context) =>
  withUser(context, async (user) => {
    const authorships = await prisma.projectAuthorships.findMany({
      where: { userId: user.id },
      include: { project: { include: { game: true } } },
    })
    const projects = authorships.map((authorship) => authorship.project)
    const projectRequests = await prisma.projectRequest.findMany({
      where: { user },
      include: { game: true },
    })

    return { props: { projects, projectRequests } }
  })

type RequestStatusProps = {
  icon: IconDefinition
  className?: string
} & PropsWithChildren
const RequestStatus: FC<RequestStatusProps> = ({
  icon,
  children,
  className,
}) => (
  <div
    className={classNames(
      'flex flex-row items-center gap-x-3 text-xl',
      className
    )}
  >
    <FontAwesomeIcon icon={icon} />
    {children}
  </div>
)

export default function MyProjectsPage({ projects, projectRequests }: Props) {
  return (
    <div className='flex flex-col gap-y-3'>
      <Head>
        <title>My Projects</title>
      </Head>
      {projectRequests.length > 0 && (
        <>
          <h1>My project requests </h1>
          {projectRequests.map((request) => (
            <ProjectCard
              key={request.id}
              name={request.projectName}
              abstract={request.projectAbstract}
              game={request.game}
            >
              {request.rejected ? (
                <RequestStatus className='text-error' icon={faTimes}>
                  Rejected
                </RequestStatus>
              ) : (
                <RequestStatus
                  className='text-warning'
                  icon={faClockRotateLeft}
                >
                  Pending
                </RequestStatus>
              )}
            </ProjectCard>
          ))}
        </>
      )}
      <>
        <PageTitle
          className='mt-2'
          rightElement={
            <LinkButton
              href='/request-project'
              icon={faAdd}
              button={{ color: 'primary' }}
            >
              Request project
            </LinkButton>
          }
        >
          My Projects
        </PageTitle>
        {projects.length === 0 && <p>{"You don't manage any projects yet."}</p>}
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            name={project.name}
            abstract={project.abstract}
            game={project.game}
          >
            <LinkButton
              href={`/${project.game.key}/${project.key}`}
              icon={faMagnifyingGlass}
              button={{ color: 'secondary' }}
            >
              View
            </LinkButton>
            <LinkButton
              href={`/${project.game.key}/${project.key}/manage`}
              icon={faEdit}
              button={{ color: 'primary' }}
            >
              Manage
            </LinkButton>
          </ProjectCard>
        ))}
      </>
    </div>
  )
}

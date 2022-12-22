import {
  faAdd,
  faClockRotateLeft,
  faEdit,
  faMagnifyingGlass,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'
import { notFound } from 'next/navigation'
import { ProjectCard } from './project-card'
import { RequestStatus } from './request-status'
import { getUser } from '@/server/server-utils'
import { prisma } from '@/server/db/client'
import { LinkButton } from '@/components/common/link-button'
import { PageTitle } from '@/components/common/page-title'

export const metadata = {
  title: 'My Projects',
}

export default async function MyProjectsPage() {
  const user = await getUser()
  if (!user) {
    notFound()
  }

  const authorships = await prisma.projectAuthorships.findMany({
    where: { userId: user.id },
    include: { project: { include: { game: true } } },
  })
  const projects = authorships.map((authorship) => authorship.project)
  const projectRequests = await prisma.projectRequest.findMany({
    where: { user },
    include: { game: true },
  })

  return (
    <div className='flex flex-col gap-y-3'>
      {projectRequests.length > 0 && (
        <>
          <PageTitle>My project requests </PageTitle>
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

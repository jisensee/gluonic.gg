import { notFound } from 'next/navigation'
import { ProjectRequestList } from './project-request-list'
import { getUser } from '@/server/server-utils'
import { prisma } from '@/server/db/client'

export const metadata = {
  title: 'Project Requests',
}

export default async function ProjectRequestsPage() {
  const user = await getUser()
  if (user?.role !== 'ADMIN') {
    notFound()
  }

  const projectRequests = await prisma.projectRequest.findMany({
    where: {
      rejected: false,
    },
    orderBy: { requestedAt: 'asc' },
    include: { game: true, user: true },
  })

  return (
    <div className='flex flex-col gap-y-3'>
      <h1>Pending project requests</h1>
      {projectRequests.length === 0 && <p>No requests at this time</p>}
      <ProjectRequestList projectRequests={projectRequests} />
    </div>
  )
}

'use client'

import { Game, ProjectRequest, User } from '@prisma/client'
import { FC, useState } from 'react'
import { ProjectCard } from './project-card'
import { trpc } from '@/utils/trpc'
import { useToast } from '@/context/toast-context'

type ProjectListProps = {
  projectRequests: (ProjectRequest & { user: User; game: Game })[]
}

export const ProjectRequestList: FC<ProjectListProps> = ({
  projectRequests,
}) => {
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

import { ProjectRequestForm } from './form'
import { EmailMessage } from './email-message'
import { prisma } from '@/server/db/client'
import { getUser } from '@/server/server-utils'
import { PageTitle } from '@/components/common/page-title'

export const metadata = {
  title: 'Request Project',
}

export default async function RequestProjectPage() {
  const user = await getUser()

  if (!user) {
    return <div>Please sign in to request a new project.</div>
  }
  const canReceiveEmail = !!user.email && user.emailVerified

  const games = await prisma.game.findMany()

  return (
    <div className='flex flex-col gap-y-3'>
      <PageTitle>{metadata.title}</PageTitle>
      {games === undefined ? (
        <p className='text-xl'>Please sign in to request a new project</p>
      ) : (
        <div className='flex flex-col gap-y-3'>
          <p>
            Please enter your project details here. After submitting, the
            project will be checked by an admin and either accepted or rejected.
          </p>
          <EmailMessage canReceiveEmail={canReceiveEmail} userId={user.id} />
          <ProjectRequestForm games={games} />
        </div>
      )}
    </div>
  )
}

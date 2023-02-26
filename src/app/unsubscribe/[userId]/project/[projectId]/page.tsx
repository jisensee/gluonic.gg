import { notFound } from 'next/navigation'
import { unsubscribeEmail } from '../../utils'
import { NextPage } from '@/utils/next-types'
import { prisma } from '@/server/db/client'
import { PageTitle } from '@/components/common/page-title'
import { UserService } from '@/server/user-service'

const UnsubscribeFromProjectPage: NextPage<{
  userId: string
  projectId: string
}> = async ({ params: { userId, projectId } }) => {
  const user = await UserService.findById(userId)
  if (!user) {
    notFound()
  }

  const subscription = await prisma.subscription.findFirst({
    where: { userId: user.id, projectId },
    include: { project: true },
  })

  if (!subscription?.project) {
    notFound()
  }

  await unsubscribeEmail(subscription)

  return (
    <div>
      <PageTitle>Sucessfully unsubscribed</PageTitle>
      <p>
        You will no longer receive email notifications for{' '}
        {subscription.project.name}
      </p>
    </div>
  )
}

export default UnsubscribeFromProjectPage

import { notFound } from 'next/navigation'
import { unsubscribeEmail } from '../utils'
import { prisma } from '@/server/db/client'
import { UserService } from '@/server/user-service'
import { PageTitle } from '@/components/common/page-title'
import { NextPage } from '@/utils/next-types'

const UnsubscribeFromAllPage: NextPage<{ userId: string }> = async ({
  params: { userId },
}) => {
  const user = await UserService.findById(userId)
  if (!user) {
    notFound()
  }
  const subscriptions = await prisma.subscription.findMany({
    where: { userId: user.id },
  })
  await prisma.$transaction([
    ...subscriptions.map(unsubscribeEmail),
    prisma.user.update({
      where: { id: user.id },
      data: { receiveEmails: false },
    }),
  ])
  await Promise.all([])
  return (
    <div>
      <PageTitle>Sucessfully unsubscribed</PageTitle>
      <p>You will no longer receive any email notifications.</p>
    </div>
  )
}

export default UnsubscribeFromAllPage

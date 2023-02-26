import { notFound } from 'next/navigation'
import { SubscriptionList } from './subscription-list'
import { getUser } from '@/server/server-utils'
import { prisma } from '@/server/db/client'
import { PageTitle } from '@/components/common/page-title'

export const metadata = {
  title: 'My Subscriptions',
}

export default async function SubscriptionsPage() {
  const user = await getUser()
  if (!user) {
    notFound()
  }

  const subscriptions = await prisma.subscription.findMany({
    where: {
      userId: user.id,
    },
    include: { project: { include: { game: true } }, game: true },
  })

  return (
    <div className='flex flex-col gap-y-7'>
      <PageTitle>{metadata.title}</PageTitle>
      <SubscriptionList
        subscriptions={subscriptions}
        hasVerifiedEmail={user.emailVerified}
        receiveEmails={user.receiveEmails}
      />
    </div>
  )
}

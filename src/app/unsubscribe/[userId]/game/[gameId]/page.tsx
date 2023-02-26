import { notFound } from 'next/navigation'
import { unsubscribeEmail } from '../../utils'
import { NextPage } from '@/utils/next-types'
import { prisma } from '@/server/db/client'
import { PageTitle } from '@/components/common/page-title'
import { UserService } from '@/server/user-service'

const UnsubscribeFromGamePage: NextPage<{
  userId: string
  gameId: string
}> = async ({ params: { userId, gameId } }) => {
  const user = await UserService.findById(userId)
  if (!user) {
    notFound()
  }

  const subscription = await prisma.subscription.findFirst({
    where: { userId: user.id, gameId },
    include: { game: true },
  })

  if (!subscription?.game) {
    notFound()
  }

  await unsubscribeEmail(subscription)

  return (
    <div>
      <PageTitle>Sucessfully unsubscribed</PageTitle>
      <p>
        You will no longer receive email notifications for{' '}
        {subscription.game.name}
      </p>
    </div>
  )
}

export default UnsubscribeFromGamePage

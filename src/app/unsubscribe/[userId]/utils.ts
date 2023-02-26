import { Subscription, SubscriptionType } from '@prisma/client'
import { prisma } from '@/server/db/client'

export const unsubscribeEmail = (subscription: Subscription) => {
  if (
    subscription.type.length === 1 &&
    subscription.type.includes(SubscriptionType.EMAIL)
  ) {
    return prisma.subscription.delete({
      where: { id: subscription.id },
    })
  } else {
    return prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        type: subscription.type.filter((t) => t != SubscriptionType.EMAIL),
      },
    })
  }
}

'use client'

import { Subscription } from '@prisma/client'
import { FC } from 'react'
import {
  SendNotification,
  usePushNotification,
  useSubscriptionNotifications,
} from '@/hooks/notification-hooks'
import { trpc } from '@/utils/trpc'

const SubscriptionManager: FC<{
  sendNotification: SendNotification
  subscriptions: Subscription[]
}> = ({ sendNotification, subscriptions }) => {
  useSubscriptionNotifications(sendNotification, subscriptions)
  return null
}

export const NotificationManager = () => {
  const { data } = trpc.subscription.withPushNotification.useQuery()
  const sendNotification = usePushNotification()

  return data && sendNotification ? (
    <SubscriptionManager
      sendNotification={sendNotification}
      subscriptions={data}
    />
  ) : null
}

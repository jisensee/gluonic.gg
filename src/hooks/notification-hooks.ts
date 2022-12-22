import { useChannel } from '@ably-labs/react-hooks'
import { useCallback, useEffect, useState } from 'react'
import { Types } from 'ably'
import { Subscription } from '@prisma/client'
import {
  AblyChannels,
  NewGameProject,
  NewProjectPost,
  SubscriptionMessage,
} from '@/utils/ably-types'

export const requestNotificationPermission = async () => {
  if (Notification.permission === 'granted') {
    return Promise.resolve(true)
  } else {
    try {
      return (await Notification.requestPermission()) === 'granted'
    } catch {
      return false
    }
  }
}

export type SendNotification = (
  title: string,
  config: { body?: string; url?: string } | undefined
) => void

export const usePushNotification = (): SendNotification | undefined => {
  const [granted, setGranted] = useState(false)
  const [reg, setReg] = useState<ServiceWorkerRegistration>()

  useEffect(() => {
    navigator.serviceWorker.getRegistration().then(setReg)
    requestNotificationPermission().then(setGranted)
  }, [])

  const sendNotification = useCallback(
    (title: string, config: { body?: string; url?: string } | undefined) => {
      reg?.showNotification(title, {
        icon: '/gluonic-logo-small.svg',
        body: config?.body,
        data: {
          url: config?.url,
        },
      })
    },
    [reg]
  )
  return granted && reg ? sendNotification : undefined
}

export const useSubscriptionNotifications = (
  sendNotification: SendNotification,
  subscriptions: Subscription[]
) => {
  const handleNewPost = ({ project, game, post }: NewProjectPost) => {
    if (subscriptions.some((sub) => sub.projectId === project.id)) {
      sendNotification('New project post', {
        body: `New post for ${project.name}`,
        url: `/${game.key}/${project.key}/posts/${post.id}`,
      })
    }
  }

  const handleNewProject = ({ project, game }: NewGameProject) => {
    if (subscriptions.some((sub) => sub.gameId === game.id)) {
      sendNotification(`New project for ${game.name}`, {
        body: `Check out ${project.name}`,
        url: `/${game.key}/${project.key}`,
      })
    }
  }

  useChannel(AblyChannels.subscriptions, (message: Types.Message) => {
    try {
      const payload = message.data as SubscriptionMessage
      switch (payload.type) {
        case 'newProjectPost':
          handleNewPost(payload)
          break
        case 'newGameProject':
          handleNewProject(payload)
          break
      }
    } catch (_e) {
      // Ignore malformed messages
    }
  })
}

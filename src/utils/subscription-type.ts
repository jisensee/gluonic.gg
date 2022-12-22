import { SubscriptionType } from '.prisma/client'
import { faComment } from '@fortawesome/free-solid-svg-icons'

export const getIconForSubscriptionType = (type: SubscriptionType) => {
  switch (type) {
    case SubscriptionType.PUSH_NOTIFICATION:
      return faComment
  }
}

export const getTextForSubscriptionType = (type: SubscriptionType) => {
  switch (type) {
    case SubscriptionType.PUSH_NOTIFICATION:
      return 'Push Notification'
  }
}

import { SubscriptionType } from '.prisma/client'
import { faComment, faEnvelopeOpen } from '@fortawesome/free-solid-svg-icons'

export const getIconForSubscriptionType = (type: SubscriptionType) => {
  switch (type) {
    case SubscriptionType.PUSH_NOTIFICATION:
      return faComment
    case SubscriptionType.EMAIL:
      return faEnvelopeOpen
  }
}

export const getTextForSubscriptionType = (type: SubscriptionType): string => {
  switch (type) {
    case SubscriptionType.PUSH_NOTIFICATION:
      return 'Push Notification'
    case SubscriptionType.EMAIL:
      return 'Email'
  }
}

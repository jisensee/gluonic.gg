'use client'

import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, useState } from 'react'
import classNames from 'classnames'
import { Game, Project, Subscription } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { SubscriptionModal } from '@/components/subscription-modal'
import { Tooltip } from '@/components/common/tooltip'

export type SubscribersProps = {
  loggedIn: boolean
  subscriberCount: number
  subscription?: Subscription
  project?: Project
  game?: Game
  hasVerifiedEmail?: boolean
  receiveEmails?: boolean
  onChange?: () => void
}

export const Subscribers: FC<SubscribersProps> = ({
  loggedIn,
  subscriberCount,
  subscription,
  project,
  game,
  hasVerifiedEmail,
  receiveEmails,
}: SubscribersProps) => {
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false)
  const { refresh } = useRouter()

  const content = (
    <div className='flex flex-row items-center gap-x-2'>
      {loggedIn &&
        hasVerifiedEmail !== undefined &&
        receiveEmails !== undefined && (
          <SubscriptionModal
            open={subscriptionModalOpen}
            onClose={() => setSubscriptionModalOpen(false)}
            subscription={subscription}
            project={project}
            game={game}
            onChange={() => {
              setSubscriptionModalOpen(false)
              refresh()
            }}
            hasVerifiedEmail={hasVerifiedEmail}
            receiveEmails={receiveEmails}
          />
        )}
      <span className='font-bold'>{subscriberCount}</span>
      <FontAwesomeIcon
        className={classNames('cursor-pointer text-2xl', {
          'text-primary': !!subscription,
        })}
        icon={faEnvelope}
        onClick={loggedIn ? () => setSubscriptionModalOpen(true) : undefined}
      />
    </div>
  )
  return loggedIn ? (
    content
  ) : (
    <Tooltip
      className='text-md mr-4 whitespace-nowrap'
      position='left'
      content='Sign in to subscribe to projects'
    >
      {content}
    </Tooltip>
  )
}

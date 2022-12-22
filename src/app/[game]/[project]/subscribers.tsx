'use client'

import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, useState } from 'react'
import classNames from 'classnames'
import { Project, Subscription } from '@prisma/client'
import { SubscriptionModal } from '@/components/subscription-modal'
import { Tooltip } from '@/components/common/tooltip'

type SubscribersProps = {
  loggedIn: boolean
  subscriberCount: number
  subscription?: Subscription
  project: Project
}

export const Subscribers: FC<SubscribersProps> = ({
  loggedIn,
  subscriberCount,
  subscription,
  project,
}: SubscribersProps) => {
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false)
  const content = (
    <div className='flex flex-row gap-x-2 items-center'>
      <SubscriptionModal
        open={subscriptionModalOpen}
        onClose={() => setSubscriptionModalOpen(false)}
        subscription={subscription}
        project={project}
        onChange={() => {
          setSubscriptionModalOpen(false)
        }}
      />
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

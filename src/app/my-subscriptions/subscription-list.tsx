'use client'

import { Game, Project, Subscription } from '@prisma/client'
import { FC, useState } from 'react'
import { SubscriptionEntry } from './subscription-entry'
import { SubscriptionModal } from '@/components/subscription-modal'

type ExpandedSubscription = Subscription & {
  game?: Game | null
  project?: (Project & { game: Game }) | null
}

export type SubscriptionListProps = {
  subscriptions: ExpandedSubscription[]
}

export const SubscriptionList: FC<SubscriptionListProps> = ({
  subscriptions,
}) => {
  const [managingSubscription, setManagingSubscription] =
    useState<ExpandedSubscription>()

  return (
    <>
      <SubscriptionModal
        open={!!managingSubscription}
        onClose={() => setManagingSubscription(undefined)}
        subscription={managingSubscription}
        game={managingSubscription?.game ?? undefined}
        project={managingSubscription?.project ?? undefined}
        onChange={() => {
          setManagingSubscription(undefined)
        }}
      />

      {subscriptions.map((sub) => (
        <div key={sub.id}>
          {sub.project && (
            <SubscriptionEntry
              name={sub.project.name}
              logoUrl={sub.project.logoUrl ?? sub.project.game.logoUrl}
              href={`/${sub.project.game.key}/${sub.project.key}`}
              types={sub.type}
              onManage={() => setManagingSubscription(sub)}
            />
          )}
        </div>
      ))}
    </>
  )
}

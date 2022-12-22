import { Game, Project, Subscription, SubscriptionType } from '@prisma/client'
import { FC, useCallback, useEffect, useState } from 'react'
import { Button, Toggle } from 'react-daisyui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { Modal } from './common/modal'
import { SaveButton } from './common/form'
import { requestNotificationPermission } from '@/hooks/notification-hooks'
import {
  mutationToToastStatus,
  useStatusToast,
  useToast,
} from '@/context/toast-context'
import {
  getIconForSubscriptionType,
  getTextForSubscriptionType,
} from '@/utils/subscription-type'
import { trpc } from '@/utils/trpc'

type HelpTextProps = {
  name: string
  text: string
}

const HelpText: FC<HelpTextProps> = ({ name, text }) => (
  <>
    <span className='italic'>{text}</span>
    <span className='font-bold text-primary'>{name}</span>
  </>
)

export type SubscriptionModalProps = {
  open: boolean
  onClose: () => void
  subscription?: Subscription
  project?: Project
  game?: Game
  onChange: () => void
}

export const SubscriptionModal: FC<SubscriptionModalProps> = ({
  open,
  onClose,
  subscription,
  project,
  game,
  onChange,
}) => {
  const [checkedTypes, setCheckedTypes] = useState<Set<SubscriptionType>>(
    new Set(subscription?.type ?? [])
  )
  const gameOrProjectName = project?.name ?? game?.name ?? ''

  const { mutateAsync: upsertSubscription, status: upsertStatus } =
    trpc.subscription.upsert.useMutation()
  const { mutateAsync: deleteSubscription, status: deleteStatus } =
    trpc.subscription.delete.useMutation()

  useStatusToast(mutationToToastStatus(deleteStatus), {
    success: {
      title: `Unsubscribed from ${gameOrProjectName}`,
    },
    error: {
      title: 'Could not Unsubscribe',
    },
  })
  useStatusToast(mutationToToastStatus(upsertStatus), {
    success: {
      title: subscription
        ? `Updated your subscription to ${gameOrProjectName}`
        : `Subscribed to ${gameOrProjectName}`,
    },
    error: {
      title: subscription
        ? 'Could not subscribe'
        : 'Could not update subscription',
    },
  })

  const onUnsubscribe = () => {
    if (subscription?.id) {
      deleteSubscription({ subscriptionId: subscription?.id }).then(onChange)
    }
  }

  const onSave = () =>
    upsertSubscription({
      projectId: project?.id,
      gameId: game?.id,
      type: [...checkedTypes],
    }).then(onChange)

  useEffect(() => {
    if (subscription) {
      setCheckedTypes(new Set(subscription.type))
    }
  }, [subscription])

  const { showToast } = useToast()

  const toggleType = useCallback(
    async (t: SubscriptionType) => {
      const isActivatingPush =
        t === 'PUSH_NOTIFICATION' && !checkedTypes.has('PUSH_NOTIFICATION')
      if (isActivatingPush) {
        const granted = await requestNotificationPermission()
        if (!granted) {
          showToast({
            title: 'Could not activate push notifications',
            message:
              'Please try again and allow push notifications when asked.',
            status: 'error',
          })
          return
        }
      }
      const newSet = new Set(checkedTypes)
      if (newSet.has(t)) {
        newSet.delete(t)
      } else {
        newSet.add(t)
      }
      setCheckedTypes(newSet)
    },
    [checkedTypes, showToast]
  )

  const noTypesSelected = checkedTypes.size === 0

  const toggle = useCallback(
    (type: SubscriptionType) => (
      <div className='flex flex-row gap-x-3 items-center'>
        <label className='flex flex-row gap-x-3 items-center cursor-pointer'>
          <Toggle
            color='primary'
            checked={checkedTypes.has(type)}
            onChange={() => toggleType(type)}
          />
          {getTextForSubscriptionType(type)}
          <FontAwesomeIcon icon={getIconForSubscriptionType(type)} />
        </label>
      </div>
    ),
    [checkedTypes, toggleType]
  )

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        subscription
          ? 'Manage subscription'
          : `Subscribe to ${gameOrProjectName}`
      }
      actions={
        <>
          {subscription && (
            <Button
              onClick={onUnsubscribe}
              color='error'
              startIcon={<FontAwesomeIcon icon={faTrash} />}
            >
              Unsubscribe
            </Button>
          )}
          <SaveButton onClick={onSave} disabled={noTypesSelected}>
            {subscription ? 'Save Changes' : 'Subscribe'}
          </SaveButton>
        </>
      }
    >
      {game && (
        <HelpText
          name={game.name}
          text='Get notified whenever a new project is published for '
        />
      )}
      {project && (
        <HelpText
          name={project.name}
          text='Get notified whenever a new post is published for '
        />
      )}
      <div className='flex flex-col gap-y-2 my-4'>
        {toggle('PUSH_NOTIFICATION')}
      </div>
      {noTypesSelected && (
        <span className='text-error'>
          Please select at least one notification type.
        </span>
      )}
    </Modal>
  )
}

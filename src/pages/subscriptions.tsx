import { GetServerSideProps } from 'next'
import { Game, Project, Subscription, SubscriptionType } from '@prisma/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { withUser } from '@/server/server-utils'
import { prisma } from '@/server/db/client'
import { Link } from '@/components/link'
import { Tooltip } from '@/components/common/tooltip'
import { SubscriptionModal } from '@/components/subscription-modal'
import { getIconForSubscriptionType } from '@/utils/subscription-type'

type ExpandedSubscription = Subscription & {
  game: Game
  project: Project & { game: Game }
}

type EntryProps = {
  name: string
  logoUrl: string
  href: string
  types: SubscriptionType[]
  onManage: () => void
}

const Entry: FC<EntryProps> = ({ name, logoUrl, href, types, onManage }) => (
  <div className='items-center flex flex-row gap-x-7'>
    <Link className='flex flex-row items-center gap-x-2' href={href}>
      <img className='h-10 w-10' src={logoUrl} alt={name} />
      <h3>{name}</h3>
    </Link>
    <Tooltip content='Manage this subscription' position='left'>
      <div
        className='flex flex-row gap-x-1 items-center cursor-pointer'
        onClick={onManage}
      >
        {types.map(getIconForSubscriptionType).map((icon) => (
          <FontAwesomeIcon
            key={icon.iconName}
            className='text-xl'
            icon={icon}
          />
        ))}
      </div>
    </Tooltip>
  </div>
)

type Props = {
  subscriptions: ExpandedSubscription[]
}

export const getServerSideProps: GetServerSideProps = (context) =>
  withUser(context, async (user) => {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: user.id,
      },
      include: { project: { include: { game: true } }, game: true },
    })

    return { props: { subscriptions } }
  })

export default function SubscriptionsPage({ subscriptions }: Props) {
  const [managingSubscription, setManagingSubscription] =
    useState<ExpandedSubscription>()
  const router = useRouter()

  return (
    <div className='flex flex-col gap-y-7'>
      <Head>
        <title>My subscriptions</title>
      </Head>
      <h1>My Subscriptions</h1>
      <SubscriptionModal
        open={!!managingSubscription}
        onClose={() => setManagingSubscription(undefined)}
        subscription={managingSubscription}
        game={managingSubscription?.game}
        project={managingSubscription?.project}
        onChange={() => {
          setManagingSubscription(undefined)
          router.replace(router.asPath)
        }}
      />
      {subscriptions.map((sub) => (
        <div key={sub.id}>
          {sub.project && (
            <Entry
              name={sub.project.name}
              logoUrl={sub.project.logoUrl ?? sub.project.game.logoUrl}
              href={`/${sub.project.game.key}/${sub.project.key}`}
              types={sub.type}
              onManage={() => setManagingSubscription(sub)}
            />
          )}
        </div>
      ))}
    </div>
  )
}

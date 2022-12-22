'use client'

import { SubscriptionType } from '@prisma/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC } from 'react'
import { Link } from '@/components/link'
import { Tooltip } from '@/components/common/tooltip'
import { getIconForSubscriptionType } from '@/utils/subscription-type'

type EntryProps = {
  name: string
  logoUrl: string
  href: string
  types: SubscriptionType[]
  onManage: () => void
}

export const SubscriptionEntry: FC<EntryProps> = ({
  name,
  logoUrl,
  href,
  types,
  onManage,
}) => (
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

import Image from 'next/image'
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
  <div className='flex flex-row items-center gap-x-7'>
    <Link className='flex flex-row items-center gap-x-2' href={href}>
      <div className='relative h-10 w-10'>
        <Image className='object-contain' src={logoUrl} alt={name} fill />
      </div>
      <h3>{name}</h3>
    </Link>
    <Tooltip content='Manage this subscription' position='top'>
      <div
        className='flex cursor-pointer flex-row items-center gap-x-3'
        onClick={onManage}
      >
        {types
          .map(getIconForSubscriptionType)
          .map(
            (icon) =>
              icon && (
                <FontAwesomeIcon
                  key={icon.iconName}
                  className='text-xl'
                  icon={icon}
                />
              )
          )}
      </div>
    </Tooltip>
  </div>
)

import {
  faAdd,
  faAngleDown,
  faCogs,
  faEnvelope,
  faSignOut,
  faTableList,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC } from 'react'
import { User } from '@prisma/client'
import { shortenAddress } from '@/format'
import { Dropdown } from '@/components/common/dropdown'

const formatName = (user: User) =>
  user.name && user.name.length > 0 ? user.name : shortenAddress(user.address)

type UserMenuProps = {
  user: User
  signOut: () => void
}

export const UserMenu: FC<UserMenuProps> = ({ signOut, user }) => {
  return user ? (
    <Dropdown
      toggle={
        <div className='flex flex-row items-center gap-x-3 text-xl normal-case text-primary'>
          {formatName(user)}
          <FontAwesomeIcon icon={faAngleDown} />
        </div>
      }
      items={[
        {
          text: 'Administration',
          icon: faCogs,
          href: '/admin',
          hidden: user.role !== 'ADMIN',
        },
        {
          text: 'My Profile',
          icon: faUser,
          href: '/profile',
        },
        {
          text: 'My Subscriptions',
          icon: faEnvelope,
          href: '/my-subscriptions',
        },
        {
          text: 'My Projects',
          icon: faTableList,
          href: '/my-projects',
        },
        {
          text: 'My Favorites',
          icon: faTableList,
          href: '/my-favorites',
        },
        {
          text: 'Request Project',
          icon: faAdd,
          href: '/request-project',
        },
        {
          text: 'Sign out',
          icon: faSignOut,
          onClick: signOut,
        },
      ]}
    />
  ) : null
}

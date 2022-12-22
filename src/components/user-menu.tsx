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
import { Dropdown } from './common/dropdown'
import { useAuthContext } from '@/context/auth-context'
import { shortenAddress } from '@/format'

const formatName = (user: User) =>
  user.name && user.name.length > 0 ? user.name : shortenAddress(user.address)

type UserMenuProps = {
  signOut: () => void
}

export const UserMenu: FC<UserMenuProps> = ({ signOut }) => {
  const { user } = useAuthContext()

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
          href: '/subscriptions',
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

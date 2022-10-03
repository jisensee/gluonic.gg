import {
  faAngleDown,
  faSignOut,
  faTableList,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { isAddress } from 'ethers/lib/utils'
import { FC } from 'react'
import { Dropdown } from 'react-daisyui'
import { Link } from './link'
import { useAuthContext } from '@/context/auth-context'
import { shortenAddress } from '@/format'

const formatName = (name: string) => {
  if (isAddress(name)) {
    return shortenAddress(name)
  }
  return name
}

type UserMenuProps = {
  signOut: () => void
  name: string
}

export const UserMenu: FC<UserMenuProps> = ({ signOut, name }) => {
  const { user } = useAuthContext()

  return (
    <Dropdown horizontal='center' className=''>
      <Dropdown.Toggle color='ghost'>
        <div className='flex flex-row items-center gap-x-3 text-primary normal-case text-xl'>
          {formatName(name)}
          <FontAwesomeIcon icon={faAngleDown} />
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu className='right-0 w-fit bg-base-200 border border-primary whitespace-nowrap'>
        {user?.isProjectAuthor && (
          <Dropdown.Item>
            <FontAwesomeIcon icon={faTableList} fixedWidth />
            <Link href='/my-projects'>My projects</Link>
          </Dropdown.Item>
        )}
        <Dropdown.Item>
          <FontAwesomeIcon icon={faUser} fixedWidth />
          <Link href='/profile'>My Profile</Link>
        </Dropdown.Item>
        <Dropdown.Item onClick={signOut}>
          <FontAwesomeIcon icon={faSignOut} fixedWidth />
          Sign out
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

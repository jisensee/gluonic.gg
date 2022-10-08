import {
  faAdd,
  faAngleDown,
  faCogs,
  faSignOut,
  faStar,
  faTableList,
  faUser,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { isAddress } from 'ethers/lib/utils'
import { FC, PropsWithChildren } from 'react'
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

type ItemProps = {
  href: string
  icon: IconDefinition
} & PropsWithChildren
const Item: FC<ItemProps> = ({ href, icon, children }) => (
  <Dropdown.Item
    onClick={() => (document.activeElement as HTMLElement)?.blur()}
  >
    <Link className='flex flex-row gap-x-3 items-center' href={href}>
      <FontAwesomeIcon icon={icon} fixedWidth />
      {children}
    </Link>
  </Dropdown.Item>
)

type UserMenuProps = {
  signOut: () => void
  name: string
}

export const UserMenu: FC<UserMenuProps> = ({ signOut, name }) => {
  const { user } = useAuthContext()

  return (
    <Dropdown horizontal='center'>
      <Dropdown.Toggle color='ghost'>
        <div className='flex flex-row items-center gap-x-3 text-primary normal-case text-xl'>
          {formatName(name)}
          <FontAwesomeIcon icon={faAngleDown} />
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu className='right-0 w-fit bg-base-200 border border-primary whitespace-nowrap'>
        <Item href='/profile' icon={faUser}>
          My Profile
        </Item>
        {user?.isAdmin && (
          <Item href='/admin' icon={faCogs}>
            Administration
          </Item>
        )}
        <Item href='/my-projects' icon={faTableList}>
          My Projects
        </Item>
        <Item href='/my-favorites' icon={faStar}>
          My Favorites
        </Item>
        <Item href='/request-project' icon={faAdd}>
          Request Project
        </Item>
        <Dropdown.Item onClick={signOut}>
          <FontAwesomeIcon icon={faSignOut} fixedWidth />
          Sign out
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

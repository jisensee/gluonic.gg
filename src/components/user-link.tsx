import { FC } from 'react'
import { Link } from './link'
import { Format } from '@/format'

type UserLinkProps = {
  id: string
  name: string | null
}
export const UserLink: FC<UserLinkProps> = ({ id, name }) => (
  <Link className='text-xl' href={`/users/${id}`} highlight>
    {Format.username(name)}
  </Link>
)

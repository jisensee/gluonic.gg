'use client'

import Image from 'next/image'
import { Navbar } from 'react-daisyui'
import { User } from '@prisma/client'
import { FC } from 'react'
import { UserMenu } from './user-menu'
import { useSignIn } from '@/hooks/auth-hooks'
import { Link } from '@/components/link'
import { SignInButton } from '@/components/signin-button'

type HeaderProps = {
  user?: User
}

export const Header: FC<HeaderProps> = ({ user }) => {
  const { signOut } = useSignIn()

  return (
    <div>
      <Navbar className='rounded-b bg-base-300'>
        <div className='main-container flex flex-row items-center px-3'>
          <Link className='relative h-12 w-32' href='/'>
            <Image src='/gluonic-logo.svg' alt='gluonic logo' fill />
          </Link>
          <div className='grow' />
          {user ? <UserMenu user={user} signOut={signOut} /> : <SignInButton />}
        </div>
      </Navbar>
    </div>
  )
}

import { useSession } from 'next-auth/react'
import { Navbar } from 'react-daisyui'
import classNames from 'classnames'
import { UserMenu } from '../user-menu'
import { Link } from '../link'
import { SignInButton } from '../signin-button'
import { useAuthContext } from '@/context/auth-context'
import { useIsPageLoading } from '@/hooks/router-hooks'
import { useSignIn } from '@/hooks/auth-hooks'

export const Header = () => {
  const { status } = useSession()
  const { loading: authLoading } = useAuthContext()
  const isPageLoading = useIsPageLoading()
  const { signOut } = useSignIn()

  return (
    <div>
      <Navbar className='rounded-b bg-base-300'>
        <div className='main-container flex flex-row items-center px-3'>
          <Link href='/'>
            <img src='/gluonic-logo.svg' className='h-12' alt='gluonic logo' />
          </Link>
          <div className='grow' />
          {!authLoading && (
            <>
              {status === 'unauthenticated' && <SignInButton />}
              {status === 'authenticated' && <UserMenu signOut={signOut} />}
            </>
          )}
        </div>
      </Navbar>
      <div
        className={classNames('h-1', {
          'animate-pulse bg-secondary': isPageLoading,
          'bg-base-300': !isPageLoading,
        })}
      />
    </div>
  )
}

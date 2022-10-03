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
  const { user, loading: authLoading } = useAuthContext()
  const isPageLoading = useIsPageLoading()
  const { signOut } = useSignIn()

  return (
    <div>
      <Navbar className='bg-base-300 rounded-b'>
        <div className='main-container flex flex-row items-center px-2'>
          <Link href='/'>
            <img src='/gluonic-logo.svg' className='h-12' />
          </Link>
          <div className='grow' />
          {!authLoading && (
            <>
              {status === 'unauthenticated' && <SignInButton />}
              {status === 'authenticated' && user?.name && (
                <UserMenu signOut={signOut} name={user.name} />
              )}
            </>
          )}
        </div>
      </Navbar>
      <div
        className={classNames('h-1', {
          'bg-secondary animate-pulse': isPageLoading,
          'bg-base-300': !isPageLoading,
        })}
      />
    </div>
  )
}

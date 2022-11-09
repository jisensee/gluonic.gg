import React, {
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useSession } from 'next-auth/react'
import { Socials, User } from '@prisma/client'
import { trpc } from '@/utils/trpc'

type UserType = User & { socials: Socials }

export type AuthContext = {
  user?: UserType
  loading: boolean
  updateUser: (user: UserType) => void
}

const Context = React.createContext<AuthContext>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateUser: () => {},
  loading: true,
})

export const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { refetch: fetchUser } = trpc.user.current.useQuery(undefined, {
    enabled: false,
  })
  const [userLoading, setUserLoading] = useState(false)
  const { status } = useSession()
  const [user, setUser] = useState<UserType>()
  const loading = userLoading || status === 'loading'

  useEffect(() => {
    if (status === 'authenticated') {
      setUserLoading(true)
      fetchUser()
        .then(({ data }) => {
          if (data) {
            setUser(data)
          }
        })
        .finally(() => setUserLoading(false))
    }
  }, [status, fetchUser])

  const value: AuthContext = {
    user,
    updateUser: setUser,
    loading,
  }
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export const useAuthContext = () => useContext(Context)

import React, {
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useSession } from 'next-auth/react'
import {
  OwnUserDataFragment,
  useCurrentUserQuery,
} from '@/generated/graphql-hooks'

export type AuthContext = {
  user?: OwnUserDataFragment
  loading: boolean
  updateUser: (user: OwnUserDataFragment) => void
}

const Context = React.createContext<AuthContext>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateUser: () => {},
  loading: true,
})

export const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { refetch: fetchUser } = useCurrentUserQuery({}, { enabled: false })
  const [userLoading, setUserLoading] = useState(false)
  const { status } = useSession()
  const [user, setUser] = useState<OwnUserDataFragment>()
  const loading = userLoading || status === 'loading'

  useEffect(() => {
    if (status === 'authenticated') {
      setUserLoading(true)
      fetchUser()
        .then(({ data }) => {
          if (data?.currentUser) {
            setUser(data.currentUser)
          }
        })
        .finally(() => setUserLoading(false))
    }
  }, [status])

  const value: AuthContext = {
    user,
    updateUser: setUser,
    loading,
  }
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export const useAuthContext = () => useContext(Context)

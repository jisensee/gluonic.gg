'use client'

import { getDefaultProvider } from 'ethers'
import { SessionProvider } from 'next-auth/react'
import { PropsWithChildren, useEffect } from 'react'
import { createClient, WagmiConfig } from 'wagmi'
import { configureAbly } from '@ably-labs/react-hooks'
import '@fortawesome/fontawesome-svg-core/styles.css'

import { TrpcProvider } from './utils/trpc'
import { ToastProvider } from '@/context/toast-context'
import { WalletContextProvider } from '@/hooks/wallet-context'

const wagmiClient = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
})

export const Providers = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    configureAbly({
      key: process.env.NEXT_PUBLIC_ABLY_SUBSCRIBE_KEY,
    })
  }, [])
  return (
    <TrpcProvider>
      <WagmiConfig client={wagmiClient}>
        <SessionProvider refetchInterval={0}>
          <WalletContextProvider>
            <ToastProvider>{children}</ToastProvider>
          </WalletContextProvider>
        </SessionProvider>
      </WagmiConfig>
    </TrpcProvider>
  )
}

'use client'

import { SessionProvider } from 'next-auth/react'
import { PropsWithChildren, useEffect } from 'react'
import { createConfig, mainnet, WagmiConfig } from 'wagmi'
import { configureAbly } from '@ably-labs/react-hooks'
import '@fortawesome/fontawesome-svg-core/styles.css'

import { createPublicClient, http } from 'viem'
import { TrpcProvider } from './utils/trpc'
import { env } from './env.mjs'
import { ToastProvider } from '@/context/toast-context'
import { WalletContextProvider } from '@/hooks/wallet-context'

const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: mainnet,
    transport: http(),
  }),
})

export const Providers = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    configureAbly({
      key: env.NEXT_PUBLIC_ABLY_SUBSCRIBE_KEY,
    })
  }, [])
  return (
    <TrpcProvider>
      <WagmiConfig config={wagmiConfig}>
        <SessionProvider refetchInterval={0}>
          <WalletContextProvider>
            <ToastProvider>{children}</ToastProvider>
          </WalletContextProvider>
        </SessionProvider>
      </WagmiConfig>
    </TrpcProvider>
  )
}

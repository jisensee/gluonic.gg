import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Analytics } from '@vercel/analytics/react'
import { getDefaultProvider } from 'ethers'
import { NextPage } from 'next'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { FC, PropsWithChildren, ReactElement, ReactNode } from 'react'
import { createClient, WagmiConfig } from 'wagmi'
import { config } from '@fortawesome/fontawesome-svg-core'
import Head from 'next/head'
import { trpc } from '../utils/trpc'
import { Layout } from '../components/layout/layout'
import { AuthContextProvider } from '@/context/auth-context'
import '../styles/global.css'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { WalletContextProvider } from '@/hooks/wallet-context'
import { ToastProvider } from '@/context/toast-context'
import { CookieBanner } from '@/components/cookie-banner'

config.autoAddCss = false

type LayoutComponent = (page: ReactElement) => ReactNode

export type CustomPage<P = object, IP = P> = NextPage<P, IP> & {
  customLayout?: boolean
}

type CustomAppProps = AppProps & {
  Component: CustomPage
}

const wagmiClient = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
})

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
})

const Providers = ({
  pageProps,
  children,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
{ pageProps: any } & PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>
    <WagmiConfig client={wagmiClient}>
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <WalletContextProvider>
          <AuthContextProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthContextProvider>
        </WalletContextProvider>
      </SessionProvider>
    </WagmiConfig>
  </QueryClientProvider>
)

const defaultLayout: LayoutComponent = (page) => <Layout>{page}</Layout>
const customLayout: LayoutComponent = (page) => page

const App: FC<CustomAppProps> = ({ Component, pageProps }) => {
  const getLayout = Component.customLayout ? customLayout : defaultLayout
  return (
    <>
      <AppHead />
      <Providers pageProps={pageProps}>
        {getLayout(<Component {...pageProps} />)}
        <CookieBanner />
      </Providers>
      <Analytics />
    </>
  )
}

function AppHead() {
  return (
    <Head>
      <title>Gluonic</title>
      <link
        rel='apple-touch-icon'
        sizes='180x180'
        href='/apple-touch-icon.png'
      />
      <link
        rel='icon'
        type='image/png'
        sizes='32x32'
        href='/favicon-32x32.png'
      />
      <link
        rel='icon'
        type='image/png'
        sizes='16x16'
        href='/favicon-16x16.png'
      />
      <link rel='manifest' href='/manifest.json' />
      <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#dca54c' />
      <meta name='msapplication-TileColor' content='#dca54c' />
      <meta name='theme-color' content='#dca54c' />
      <meta
        name='description'
        content='Gluonic is the best place to discover community projects for your favorite games.'
      />
    </Head>
  )
}
export default trpc.withTRPC(App)

import { PropsWithChildren } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { config } from '@fortawesome/fontawesome-svg-core'
import { Metadata } from 'next/types'
import { Header } from './header'
import { Footer } from './footer'
import { Providers } from '@/providers'
import { getUser } from '@/server/server-utils'
import { NotificationManager } from '@/components/notification-manager'

import '../styles/global.css'

config.autoAddCss = false

export const metadata: Metadata = {
  title: {
    template: '%s | Gluonic',
    default: 'Gluonic',
  },
  manifest: '/manifest.json',
  icons: [
    {
      rel: 'icon',
      url: '/favicon-16x16.png',
      sizes: '16x16',
      type: 'image/png',
    },
    {
      rel: 'icon',
      url: '/favicon-32x32.png',
      sizes: '32x32',
      type: 'image/png',
    },
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'mask-icon',
      url: '/safari-pinned-tab.svg',
    },
  ],
  themeColor: '#dca54c',
}

export default async function RootLayout({ children }: PropsWithChildren) {
  const user = await getUser()
  return (
    <html lang='en'>
      <head>
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#dca54c' />
        <meta name='msapplication-TileColor' content='#dca54c' />
      </head>
      <body>
        <Providers>
          {user && <NotificationManager />}
          <div className='flex flex-col gap-y-3'>
            <Header user={user} data-superjson />
            <div className='main-container px-5 py-1'>{children}</div>
            <Footer className='main-container px-5 pb-5' />
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}

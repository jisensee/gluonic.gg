import { PropsWithChildren } from 'react'
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
}

export default async function RootLayout({ children }: PropsWithChildren) {
  const user = await getUser()
  return (
    <html lang='en'>
      <body>
        <Providers>
          {user && <NotificationManager />}
          <div className='flex flex-col gap-y-3'>
            <Header user={user} />
            <div className='main-container py-1 px-5'>{children}</div>
            <Footer className='main-container px-5 pb-5' />
          </div>
        </Providers>
      </body>
    </html>
  )
}

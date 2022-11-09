import { FC, PropsWithChildren } from 'react'
import { Footer } from './footer'
import { Header } from './header'

export const Layout: FC<PropsWithChildren> = ({ children }) => (
  <div className='flex flex-col gap-y-3'>
    <Header />
    <div className='main-container py-1 px-5'>{children}</div>
    <Footer className='main-container px-5 pb-5' />
  </div>
)

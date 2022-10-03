import { FC, PropsWithChildren } from 'react'
import { Footer } from './footer'
import { Header } from './header'

export const Layout: FC<PropsWithChildren> = ({ children }) => (
  <div className='flex flex-col gap-y-3'>
    <Header />
    <div className='py-1 main-container px-3'>{children}</div>
    <Footer className='main-container px-3 pb-5' />
  </div>
)

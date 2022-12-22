import { Metadata } from 'next/types'

export const metadata: Metadata = {
  title: 'Not found',
}

export default function NotFoundPage() {
  return (
    <div className='flex flex-col items-center gap-y-3'>
      <h1>Page not found</h1>
      This page does not exist or you might need to sign in.
    </div>
  )
}

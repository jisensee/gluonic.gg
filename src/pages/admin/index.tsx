import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Link } from '@/components/link'
import { withUser } from '@/server/server-utils'

export const getServerSideProps: GetServerSideProps<object> = (context) =>
  withUser(context, async (user) =>
    user.role === 'ADMIN' ? { props: {} } : Promise.resolve({ notFound: true })
  )

export default function AdminPage() {
  return (
    <div className='flex flex-col gap-y-3'>
      <Head>
        <title>Administration</title>
      </Head>
      <h1>Administration</h1>
      <div className='flex flex-row gap-3 flex-wrap'>
        <Link
          className='rounded-2xl px-5 py-3 border border-primary hover:bg-base-300 text-3xl'
          href='/admin/project-requests'
        >
          Project reqests
        </Link>
      </div>
    </div>
  )
}

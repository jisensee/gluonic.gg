import { notFound } from 'next/navigation'
import { Link } from '@/components/link'
import { getUser } from '@/server/server-utils'
import { PageTitle } from '@/components/common/page-title'

export const metadata = {
  title: 'Administration',
}

export default async function AdminPage() {
  const user = await getUser()
  if (user?.role != 'ADMIN') {
    notFound()
  }

  return (
    <div className='flex flex-col gap-y-3'>
      <PageTitle>{metadata.title}</PageTitle>
      <div className='flex flex-row flex-wrap gap-3'>
        <Link
          className='rounded-2xl border border-primary px-5 py-3 text-3xl hover:bg-base-300'
          href='/admin/project-requests'
        >
          Project reqests
        </Link>
      </div>
    </div>
  )
}

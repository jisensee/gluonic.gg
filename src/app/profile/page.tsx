import { notFound, redirect } from 'next/navigation'
import { getUser } from '@/server/server-utils'

export default async function ProfilePage() {
  const user = await getUser()
  if (!user) {
    notFound()
  }
  return redirect(`/users/${user.id}`)
}

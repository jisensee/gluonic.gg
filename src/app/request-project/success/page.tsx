import { notFound } from 'next/navigation'
import { Link } from '@/components/link'
import { getUser } from '@/server/server-utils'

export default async function SuccessfulProjectRequestPage() {
  const user = await getUser()
  if (!user) {
    notFound()
  }

  const canReceiveEmails = !!user.email && user.emailVerified

  return (
    <div className='flex flex-col gap-y-3'>
      <h1>Your project has been submitted successfully!</h1>
      <p>An admin will now accept or reject it (probably accept).</p>
      {canReceiveEmails && (
        <p>
          You will receive an email when your project request has been
          processed.
        </p>
      )}
      <h3>What to do next?</h3>
      <p>
        <Link href='/my-projects' highlight>
          {"Track your project's status"}
        </Link>
      </p>
      <Link href='/request-project' highlight>
        Request another project
      </Link>
    </div>
  )
}

export const metadata = {
  title: 'Project submitted',
}

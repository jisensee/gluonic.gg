import Head from 'next/head'
import { Link } from '@/components/link'
import { GluonicData } from '@/gluonic.data'

export default function SuccessfulProjectRequestPage() {
  return (
    <div className='flex flex-col gap-y-3'>
      <Head>
        <title>Project submitted</title>
      </Head>
      <h1>Your project has been submitted successfully!</h1>
      <p>
        An admin will now accept or reject it (probably accept). Please ping the
        Admin role in{' '}
        <Link href={GluonicData.discord} highlight>
          {' '}
          our discord server
        </Link>{' '}
        since there is no notification system in place yet. Thank you!
      </p>
      <h3>What to do next?</h3>
      <p>
        <Link href='/my-projects' highlight>
          {'Track your project\'s status'}
        </Link>
      </p>
      <Link href='/request-project' highlight>
        Request another project
      </Link>
    </div>
  )
}

import { notFound } from 'next/navigation'
import { ExpiredCode } from './expired-code'
import { PageTitle } from '@/components/common/page-title'
import { EmailService } from '@/server/email-service'
import { getUser } from '@/server/server-utils'
import { NextPage } from '@/utils/next-types'

const VerifyEmailPage: NextPage<{ code: string }> = async ({ params }) => {
  const user = await getUser()
  if (!user) {
    notFound()
  }
  const result = await EmailService.verifyEmail(user.id, params.code)

  if (result === 'invalid-code') {
    notFound()
  } else if (result === 'code-expired') {
    return <ExpiredCode />
  } else {
    return (
      <>
        <PageTitle className='mb-2'>Email verification successful.</PageTitle>
        You can now receive email notifications to{' '}
        <span className='text-secondary'>{user.email}</span>
      </>
    )
  }
}
export default VerifyEmailPage

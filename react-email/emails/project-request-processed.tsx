import * as React from 'react'
import { BaseEmail, EmailProps, Section, Text } from './components/base'
import { buildUrl, Button } from './components/common'

export type ProjectRequestProcessedEmailProps = {
  projectName: string
  manageProjectLink: string
  approved: boolean
  authorName?: string
} & EmailProps

export default function ProjectRequestProcessedEmail({
  projectName = 'Project',
  approved = true,
  manageProjectLink,
  authorName,
  recipientUserId,
}: ProjectRequestProcessedEmailProps) {
  const url = buildUrl(manageProjectLink)
  const resultText = approved ? 'approved' : 'rejected'

  return (
    <BaseEmail
      title={`Your project request for ${projectName} has been ${resultText}`}
      recipientUserId={recipientUserId}
    >
      <Text>Hello {authorName ?? 'anon'},</Text>
      {approved && (
        <>
          <Text className='font-bold'>
            Your request for <span className='text-primary'>{projectName}</span>{' '}
            has been approved!
          </Text>
          <Text>
            You can now set it up for publication by clicking on the following
            link. Alternatively you can log into Gluonic and find your project
            on the <span className='text-primary'>My Projects</span> page.
          </Text>
          <Section className='mt-5 text-center'>
            <Button className='w-1/2' href={url}>
              Manage project
            </Button>
          </Section>
        </>
      )}
      {!approved && (
        <Text>
          Unfortunately your request has been denied. Get in touch on discord if
          you are unsure why. You can always request the project again.
        </Text>
      )}
    </BaseEmail>
  )
}

import * as React from 'react'
import {
  BaseEmail,
  Column,
  EmailProps,
  Img,
  Heading,
  Section,
  Text,
} from './components/base'
import { buildUrl, Button } from './components/common'

export type NewPostEmailProps = {
  postLink: string
  postTitle: string
  postAbstract: string
  projectLogoUrl?: string
  projectName: string
  projectId: string
} & EmailProps

export default function NewPostEmail({
  postLink,
  postTitle = 'Post title',
  postAbstract = 'This is a post abstract',
  projectLogoUrl = 'https://gluonic.eu-central-1.linodeobjects.com/project-logo-influence-sales-aeac6c90-4e0f-41f1-aa2c-741a9e9aad90',
  projectName = 'Project name',
  projectId,
  recipientUserId,
}: NewPostEmailProps) {
  const url = buildUrl(postLink)

  return (
    <BaseEmail
      title={`New post for ${projectName}`}
      recipientUserId={recipientUserId}
      unsubscribeData={{
        text: 'Unsubscribe from emails about this project.',
        link: `/unsubscribe/${recipientUserId}/project/${projectId}`,
      }}
    >
      <Section>
        {projectLogoUrl && (
          <Column className='pr-5'>
            <Img className='h-16 w-16' src={projectLogoUrl} alt={projectName} />
          </Column>
        )}
        <Column>
          <Heading as='h1' className='text-primary'>
            {projectName} has published a new post!
          </Heading>
        </Column>
      </Section>
      <Section className='rounded-md bg-base-200 px-5'>
        <Heading as='h2' className='text-primary'>
          {postTitle}
        </Heading>
        <Text> {postAbstract} </Text>
      </Section>
      <Section className='mt-3 text-center'>
        <Button className='w-1/2' href={url}>
          Read full post
        </Button>
      </Section>
    </BaseEmail>
  )
}

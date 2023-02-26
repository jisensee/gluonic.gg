import * as React from 'react'
import {
  BaseEmail,
  Column,
  EmailProps,
  Row,
  Img,
  Section,
  Text,
} from './components/base'
import { buildUrl, Button } from './components/common'

export type NewProjectRequestEmailProps = {
  projectName: string
  projectAbstract: string
  gameName: string
  gameLogoUrl: string
  author?: string
} & EmailProps

export default function NewProjectRequestEmail({
  projectName = 'Project',
  projectAbstract = 'Project abstract',
  author = 'author',
  gameName = 'Influence',
  gameLogoUrl = 'http://localhost:3000/influence.png',
  recipientUserId,
}: NewProjectRequestEmailProps) {
  const url = buildUrl('/admin/project-requests')

  return (
    <BaseEmail
      title={`New project request ${projectName} for ${gameName}`}
      recipientUserId={recipientUserId}
    >
      <Section className='mb-2 px-4'>
        <Row>
          <Column className='pr-7'>
            <Img
              className='h-16 w-16 object-contain'
              src={gameLogoUrl}
              alt={gameName}
            />
          </Column>
          <Column className='w-full'>
            <Text className='text-2xl text-primary'>
              New project request for{' '}
              <span className='font-bold text-primary'>{gameName}</span>
            </Text>
          </Column>
        </Row>
      </Section>
      <Section className='pl-5'>
        <Text className='text-lg text-primary'>{projectName}</Text>
        <Text className='font-bold'>{projectAbstract}</Text>
        <Text className='italic'>
          By <span className='text-primary'>{author ?? 'anon'}</span>
        </Text>
      </Section>
      <Section className='mt-5 text-center'>
        <Button className='w-1/2' href={url}>
          Review request
        </Button>
      </Section>
    </BaseEmail>
  )
}

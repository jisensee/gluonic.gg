import * as React from 'react'
import {
  BaseEmail,
  Column,
  EmailProps,
  Heading,
  Row,
  Img,
  Section,
  Text,
} from './components/base'
import { buildUrl, Button } from './components/common'

export type NewProjectEmailProps = {
  projectLink: string
  projectName: string
  projectAbstract: string
  gameLogoUrl: string
  projectLogoUrl?: string
  gameName: string
  gameId: string
  authorNames: string[]
} & EmailProps

export default function NewProjectEmail({
  projectLink,
  gameLogoUrl = 'https://gluonic.gg/influence.svg',
  projectLogoUrl = 'https://gluonic.eu-central-1.linodeobjects.com/project-logo-influence-sales-aeac6c90-4e0f-41f1-aa2c-741a9e9aad90',
  projectName = 'Test',
  projectAbstract = 'Project abstract',
  gameName = 'Influence',
  gameId,
  recipientUserId,
  authorNames = ['author1', 'author2'],
}: NewProjectEmailProps) {
  const url = buildUrl(projectLink)

  return (
    <BaseEmail
      title={`New project ${projectName} for ${gameName}`}
      recipientUserId={recipientUserId}
      unsubscribeData={{
        text: 'Unsubscribe from emails about this game.',
        link: `/unsubscribe/${recipientUserId}/game/${gameId}`,
      }}
    >
      <Section className='mb-2 px-4'>
        <Row>
          <Column className='pr-7'>
            <Img className='h-16 w-16' src={gameLogoUrl} alt={gameName} />
          </Column>
          <Column>
            <Text className='text-2xl'>
              A new project for{' '}
              <span className='font-bold text-primary'>{gameName}</span> has
              been published!
            </Text>
          </Column>
        </Row>
      </Section>
      <Section className='rounded-md bg-base-200 px-5 pt-2'>
        <Row>
          {projectLogoUrl && (
            <Column className='pr-7'>
              <Img
                className='h-16 w-16'
                src={projectLogoUrl}
                alt={projectName}
              />
            </Column>
          )}
          <Column className='w-full'>
            <Heading as='h2' className='text-primary'>
              {projectName}
            </Heading>
          </Column>
        </Row>
        <Row>
          <Column colSpan={2}>
            <Text className='font-bold'> {projectAbstract} </Text>
          </Column>
        </Row>
        {authorNames.length > 0 && (
          <Row>
            <Column colSpan={2}>
              <Text>
                Made by{' '}
                <span className='text-center font-bold text-primary'>
                  {authorNames.join(', ')}
                </span>
              </Text>
            </Column>
          </Row>
        )}
      </Section>
      <Section className='mt-5 text-center'>
        <Button className='w-1/2' href={url}>
          Check out {projectName}
        </Button>
      </Section>
    </BaseEmail>
  )
}

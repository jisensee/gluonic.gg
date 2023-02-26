import { Preview } from '@react-email/preview'
import { FC, PropsWithChildren } from 'react'
import { Html } from '@react-email/html'
import { Head } from '@react-email/head'
import { Body } from '@react-email/body'
export { Text } from '@react-email/text'
export { Section } from '@react-email/section'
import { Section } from '@react-email/section'
export { Column } from '@react-email/column'
export { Heading } from '@react-email/heading'
import { Container } from '@react-email/container'
import { Hr } from '@react-email/hr'
import { Column } from '@react-email/column'
import { Link, buildUrl } from './common'
import { Tailwind } from './tailwind'
export { Row } from '@react-email/row'
export { Img } from '@react-email/img'

export type EmailProps = {
  recipientUserId: string
}

export type BaseEmailProps = {
  title: string
  preview?: string
  unsubscribeData?: {
    text: string
    link: string
  }
} & EmailProps &
  PropsWithChildren

export const BaseEmail: FC<BaseEmailProps> = ({
  title,
  preview,
  children,
  unsubscribeData,
  recipientUserId,
}) => (
  <Tailwind>
    <Html
      style={{
        fontFamily:
          'ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
      }}
    >
      <Head>
        <title>{title}</title>
      </Head>
      <Preview>{preview ?? title}</Preview>
      <Body className='bg-base-100 text-base-content'>
        <Container
          style={{
            width: '600px!important',
            margin: '0 auto',
            padding: '2rem',
          }}
        >
          <Section>
            <Column>
              {children}
              <Section className='mt-3' />
              <Hr />
              <Section className='mt-3' />
              <Section className='mb-2 text-center'>
                <Link href='https://gluonic.gg'>Gluonic.gg</Link>
              </Section>
              <Section className='mb-2 text-center'>
                <Link href='https://discord.gg/cYVzNAkQsT'>
                  Visit us on Discord
                </Link>
              </Section>
              <Section className='mb-4 text-center'>
                <Link href='https://github.com/jisensee/gluonic.gg'>
                  Check out the Github repository
                </Link>
              </Section>
              <Hr className='w-64' />
              <Section className='mt-3' />
              {unsubscribeData && (
                <Section className='mb-3 text-center'>
                  <Link href={buildUrl(unsubscribeData.link)}>
                    {unsubscribeData.text}
                  </Link>
                </Section>
              )}
              <Section className='text-center'>
                <Link href={buildUrl(`/unsubscribe/${recipientUserId}/all`)}>
                  Unsubscribe from all emails
                </Link>
              </Section>
            </Column>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
)

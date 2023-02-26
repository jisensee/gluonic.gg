import type { Metadata } from 'next/types'
import { notFound } from 'next/navigation'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { UserDataForm } from './form'
import { prisma } from '@/server/db/client'

import { getUser } from '@/server/server-utils'
import { Format } from '@/format'
import { PageTitle } from '@/components/common/page-title'
import { LinkButton } from '@/components/common/link-button'

export type Params = {
  id: string
}

// const getUserById = cache((id: string) =>
const getUserById = (id: string) =>
  prisma.user.findUnique({
    where: { id },
    include: { socials: true },
  })

export const generateMetadata = async ({
  params,
}: {
  params: Params
}): Promise<Metadata> => {
  const user = await getUserById(params.id)
  if (!user) {
    notFound()
  }
  return {
    title: Format.username(user.name),
  }
}

export default async function UserEditPage({ params }: { params: Params }) {
  const requestingUser = await getUser()
  const user = await getUserById(params.id)

  if (!user || !requestingUser) {
    return
  }

  return (
    <>
      <PageTitle
        rightElement={
          <LinkButton
            href='/profile'
            icon={faUser}
            button={{ color: 'primary' }}
          >
            View profile
          </LinkButton>
        }
      >
        Edit profile data
      </PageTitle>
      <UserDataForm
        initialData={{
          name: user.name ?? '',
          bio: user.bio ?? '',
          email: user.email ?? undefined,
          receiveEmails: user.receiveEmails,
          socials: {
            discord: user.socials.discord,
            github: user.socials.github,
            twitter: user.socials.twitter,
            website: user.socials.website,
          },
        }}
        emailVerified={user.emailVerified}
        hasDefaultName={user.address === user.name}
      />
    </>
  )
}

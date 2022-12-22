import type { Metadata } from 'next/types'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { UserDataForm } from './form'
import { prisma } from '@/server/db/client'

import { getUser } from '@/server/server-utils'
import { Format } from '@/format'

export type Params = {
  id: string
}

const getUserById = cache((id: string) =>
  prisma.user.findUnique({
    where: { id },
    include: { socials: true },
  })
)

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
      <UserDataForm
        initialData={{
          name: user.name ?? '',
          bio: user.bio ?? '',
          socials: {
            discord: user.socials.discord,
            github: user.socials.github,
            twitter: user.socials.twitter,
            website: user.socials.website,
          },
        }}
        hasDefaultName={user.address === user.name}
      />
    </>
  )
}

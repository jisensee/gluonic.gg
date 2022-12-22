import type { Metadata } from 'next/types'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import Head from 'next/head'
import { notFound } from 'next/navigation'
import { UserProjects } from './user-projects'
import { prisma } from '@/server/db/client'
import { SocialLinks } from '@/components/social-links'
import { PageTitle } from '@/components/common/page-title'
import { getUser } from '@/server/server-utils'
import { UserService } from '@/server/user-service'
import { Format } from '@/format'
import { LinkButton } from '@/components/common/link-button'

export type Params = {
  id: string
}

export const generateMetadata = async ({
  params,
}: {
  params: Params
}): Promise<Metadata> => {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
  })
  return {
    title: user ? Format.username(user.name) : undefined,
  }
}

export default async function UserPage({ params }: { params: Params }) {
  const requestingUser = await getUser()
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      socials: true,
      projectAuthorships: {
        where: { project: { published: true } },
        include: {
          project: {
            include: {
              game: true,
              socials: true,
              _count: { select: { favoritedBy: true } },
            },
          },
        },
      },
    },
  })
  if (!user) {
    notFound()
  }
  const projects = user.projectAuthorships.map((a) => a.project)
  const sameUser = requestingUser?.id === user.id
  const favoritedProjectIds = requestingUser
    ? await UserService.findFavoritedProjectIds(requestingUser)
    : []

  return (
    <div className='flex flex-col gap-y-3'>
      <Head>
        <title>{Format.username(user.name)}</title>
      </Head>
      <PageTitle
        rightElement={
          sameUser && (
            <LinkButton
              button={{ color: 'primary' }}
              icon={faEdit}
              href={`/users/${user.id}/edit`}
            >
              Edit data
            </LinkButton>
          )
        }
      >
        {Format.username(user.name)}
      </PageTitle>
      <span className='italic'>
        Member since {user.joinedAt.toLocaleDateString()}
      </span>
      {user.bio && <p>{user.bio}</p>}
      <SocialLinks
        className='flex flex-row flex-wrap justify-center gap-5 sm:justify-start'
        socials={user.socials}
      />
      <UserProjects
        projects={projects}
        favoritedProjectIds={favoritedProjectIds}
      />
    </div>
  )
}

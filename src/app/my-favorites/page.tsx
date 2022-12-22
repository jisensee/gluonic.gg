import { notFound } from 'next/navigation'
import { FavoriteList } from './favorite-list'
import { getUser } from '@/server/server-utils'
import { prisma } from '@/server/db/client'
import { PageTitle } from '@/components/common/page-title'

export const metadata = {
  title: 'My Favorites',
}

export default async function MyFavoritesPage() {
  const user = await getUser()
  if (!user) {
    notFound()
  }

  const projects = await prisma.user
    .findUnique({
      where: { id: user.id },
      include: {
        favoritedProjects: {
          include: {
            game: true,
            socials: true,
            _count: { select: { favoritedBy: true } },
          },
        },
      },
    })
    .then((u) => u?.favoritedProjects ?? [])

  return (
    <div className='flex flex-col gap-y-3'>
      <PageTitle>{metadata.title}</PageTitle>
      {projects.length === 0 && <p>You have not favorited any projects yet.</p>}
      <FavoriteList projects={projects} />
    </div>
  )
}

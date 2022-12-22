import { cache } from 'react'
import { prisma } from '@/server/db/client'

export const getProject = cache((gameKey: string, projectKey: string) =>
  prisma.project.findFirst({
    where: { key: projectKey, game: { key: gameKey } },
    include: {
      _count: { select: { favoritedBy: true, subscriptions: true } },
      socials: true,
      game: true,
      posts: { take: 3, orderBy: [{ publishedAt: 'desc' }] },
      projectAuthorships: { include: { user: true } },
    },
  })
)

export type Params = {
  game: string
  project: string
}

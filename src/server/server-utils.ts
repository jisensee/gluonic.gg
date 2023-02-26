import { Project, User, UserRole } from '@prisma/client'

import { getServerSession } from 'next-auth/next'
import { prisma } from '@/server/db/client'

export const canUserManageProject = async (project: Project, user: User) =>
  user.role === UserRole.ADMIN ||
  prisma.projectAuthorships
    .count({
      where: {
        projectId: project.id,
        userId: user.id,
      },
    })
    .then((count) => count > 0)

// export const getUser = cache(async () => {
export const getUser = async () => {
  const session = await getServerSession()
  const userId = session?.user?.email
  if (userId) {
    return (
      (await prisma.user.findUnique({ where: { id: userId } })) ?? undefined
    )
  }
}

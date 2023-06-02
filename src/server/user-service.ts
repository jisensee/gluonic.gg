import { User } from '@prisma/client'
import { getLogger } from './logger'
import { prisma } from '@/server/db/client'

const findById = (id: string) => prisma.user.findUnique({ where: { id } })

const findOrCreate = async (address: string) => {
  const user = await prisma.user.findUnique({ where: { address } })
  if (!user) {
    const newUser = prisma.user.create({
      data: {
        address,
        joinedAt: new Date(),
        socials: { create: {} },
      },
    })
    getLogger('UserService').info('Created new user', {
      type: 'userCreated',
    })
    return newUser
  }
  return user
}

const findFavoritedProjectIds = async (user: User) =>
  (await prisma.user
    .findUnique({
      where: { id: user.id },
      include: { favoritedProjects: true },
    })
    .then((u) => u?.favoritedProjects.map((p) => p.id))) ?? []

export const UserService = {
  findById,
  findOrCreate,
  findFavoritedProjectIds,
}

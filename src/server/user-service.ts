import { User } from '@prisma/client'
import { maybePromise } from '@/fp-utils'
import { db } from '@/server/db'

const findById = (id: string) =>
  maybePromise(db.user.findUnique({ where: { id } }))

const findOrCreate = async (address: string) => {
  const user = await db.user.findUnique({ where: { address } })
  if (!user) {
    return db.user.create({
      data: {
        address,
        joinedAt: new Date(),
        socials: { create: {} },
      },
    })
  }
  return user
}

const findSocials = (user: User) =>
  maybePromise(
    db.user.findUnique({ where: { id: user.id }, include: { socials: true } })
  ).map((u) => u.socials)

const findFavoritedProjectIds = async (user: User) =>
  (await db.user
    .findUnique({
      where: { id: user.id },
      include: { favoritedProjects: true },
    })
    .then((u) => u?.favoritedProjects.map((p) => p.id))) ?? []

export const UserService = {
  findById,
  findOrCreate,
  findSocials,
  findFavoritedProjectIds,
}

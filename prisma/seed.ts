import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const seed = async () => {
  const user = await db.user.findFirst()
  if (!user) {
    console.log(
      'Need a user to seed the DB. Sign in on localhost:3000 with a test address and then run the seed again.'
    )
    return
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      name: 'TestAdmin',
      bio: 'I test things.',
    },
  })

  await db.user.updateMany({ data: { role: 'ADMIN' } })

  await db.game
    .create({
      data: {
        key: 'influence',
        name: 'Influence',
        description: 'Space-Strategy MMO built on StarkNet.',
        logoUrl: '/influence.svg',
        website: 'https://influenceth.io',
        socials: {
          create: {
            twitter: 'https://twitter.com/influenceth',
            discord: 'https://discord.gg/UHMqbznhJS',
          },
        },
        projects: {
          create: {
            key: 'adalia.info',
            name: 'adalia.info',
            logoUrl:
              'https://gluonic.eu-central-1.linodeobjects.com/project-logo-adalia.info-b8eb2b04-6e0b-4675-91f5-ef1060e1118d',
            abstract: 'View, filter, sort asteroids.',
            website: 'https://adalia.info',
            projectAuthorships: {
              create: {
                userId: user.id,
                type: 'ADMIN',
              },
            },
            published: true,
            socials: {
              create: {
                discord: 'https://discord.gg/XynYK5yCQy',
                github: 'https://github.com/jisensee/adalia.info',
              },
            },
          },
        },
      },
    })
    .then()
}

seed()

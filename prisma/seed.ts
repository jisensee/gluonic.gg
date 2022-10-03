import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const seed = async () =>
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
            abstract: 'View, filter, sort asteroids.',
            website: 'https://adalia.info',
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

seed()

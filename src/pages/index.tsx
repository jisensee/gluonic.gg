import { Game, Socials } from '@prisma/client'
import { GetStaticProps } from 'next'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import Head from 'next/head'
import { prisma } from '@/server/db/client'
import { GameProjectCard } from '@/components/game-project-card'
import { Link } from '@/components/link'

type Props = {
  games: (Game & { socials: Socials; _count: { projects: number } })[]
}
export const getStaticProps: GetStaticProps<Props> = async () => {
  const games = await prisma.game.findMany({
    include: {
      socials: true,
      _count: {
        select: {
          projects: {
            where: { published: true },
          },
        },
      },
    },
  })
  return {
    props: {
      games,
    },
    revalidate: 60,
  }
}

export default function HomePage({ games }: Props) {
  return (
    <div className='flex flex-col gap-y-5'>
      <Head>
        <title>Gluonic</title>
      </Head>
      <div className='flex flex-col gap-y-3 text-center'>
        <p className='text-5xl'>
          Welcome to <span className='font-bold text-primary'>Gluonic</span>
        </p>
        <p className='text-2xl'>
          The place to discover all the community projects for your favourite
          game!
        </p>
        <Link className='text-xl' href='/request-project' highlight>
          Add your project!
        </Link>
      </div>
      {games.map((game) => (
        <GameProjectCard
          key={game.key}
          detailLink={`/${game.key}`}
          detailText={`Discover ${game._count.projects} projects`}
          detailIcon={faMagnifyingGlass}
          title={game.name}
          abstract={game.description}
          logoUrl={game.logoUrl}
          website={game.website}
          socials={game.socials}
        />
      ))}
    </div>
  )
}

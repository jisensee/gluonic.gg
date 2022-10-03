import { Game, Socials } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import Head from 'next/head'
import { db } from '@/server/db'
import { GameProjectCard } from '@/components/game-project-card'
import { GluonicData } from '@/gluonic.data'
import { Link } from '@/components/link'

type Props = {
  games: (Game & { socials: Socials })[]
}
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const games = await db.game.findMany({ include: { socials: true } })
  return {
    props: {
      games,
    },
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
        <p className=''>
          Reach out in our{' '}
          <Link href={GluonicData.discord} external highlight>
            discord server
          </Link>{' '}
          if you would like to have your project added.
        </p>
      </div>
      {games.map((game) => (
        <GameProjectCard
          key={game.key}
          detailLink={`/${game.key}`}
          detailText='Discover projects'
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

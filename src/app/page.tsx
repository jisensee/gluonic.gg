import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { prisma } from '@/server/db/client'
import { GameProjectCard } from '@/components/game-project-card'
import { Link } from '@/components/link'
import { getUser } from '@/server/server-utils'

export default async function HomePage() {
  const user = await getUser()

  const games = await prisma.game.findMany({
    include: {
      socials: true,
      _count: {
        select: {
          projects: {
            where: { published: true },
          },
          subscriptions: true,
        },
      },
    },
  })

  const subscribedGames = user
    ? await prisma.subscription.findMany({
        where: { userId: user.id, gameId: { not: null } },
      })
    : []

  return (
    <div className='flex flex-col gap-y-5'>
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
          subscribersProps={{
            loggedIn: !!user,
            hasVerifiedEmail: user?.emailVerified,
            receiveEmails: user?.receiveEmails,
            game,
            subscriberCount: game._count.subscriptions,
            subscription: subscribedGames.find((s) => s.gameId === game.id),
          }}
        />
      ))}
    </div>
  )
}

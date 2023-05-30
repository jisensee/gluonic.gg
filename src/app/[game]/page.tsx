import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Metadata } from 'next/types'
import { Projects } from './projects'
import { Subscribers } from './[project]/subscribers'
import { prisma } from '@/server/db/client'
import { LinkButton } from '@/components/common/link-button'
import { SocialLinks } from '@/components/social-links'
import { getUser } from '@/server/server-utils'
import { UserService } from '@/server/user-service'

// const getGame = cache((key: string) =>
const getGame = (key: string) =>
  prisma.game.findUnique({
    where: { key },
  })

type Params = {
  game: string
}
export const generateMetadata = async ({
  params,
}: {
  params: Params
}): Promise<Metadata> => {
  const game = await getGame(params.game)
  return { title: game?.name }
}

type P = {
  params: Params
}

// export default async function GamePage({ params }: { params: Params }) {
export default async function GamePage(p: P) {
  const params = p.params
  const user = await getUser()
  const favoritedProjectIds = user
    ? await UserService.findFavoritedProjectIds(user)
    : undefined

  const game = await prisma.game.findUnique({
    where: { key: params.game },
    include: {
      _count: { select: { subscriptions: true } },
      socials: true,
      projects: {
        where: { published: true },
        include: {
          socials: true,
          _count: { select: { favoritedBy: true, subscriptions: true } },
        },
        orderBy: [
          {
            lastUpdate: 'desc',
          },
        ],
      },
    },
  })
  if (!game) {
    notFound()
  }

  const gameSubscription = user
    ? await prisma.subscription.findFirst({
        where: { userId: user.id, gameId: game.id },
      })
    : undefined

  const projectSubscriptions = user
    ? await prisma.subscription.findMany({
        where: {
          userId: user.id,
          projectId: { in: game.projects.map((p) => p.id) },
        },
      })
    : []

  const gameHeader = (
    <div className='flex flex-col gap-y-3 rounded-2xl bg-base-200 px-5 py-3 '>
      <div className='flex flex-row items-center gap-x-5'>
        <div className='relative h-12 w-12'>
          <Image
            className='object-contain'
            src={game.logoUrl}
            alt={`${game.name} logo`}
            fill
          />
        </div>
        <h1 className='grow'>{game.name}</h1>
        <div className='hidden flex-row gap-x-5 sm:flex'>
          <LinkButton
            className='hidden md:flex'
            href={game.website}
            icon={faGlobe}
            button={{ color: 'secondary' }}
            external
          >
            Website
          </LinkButton>
          <SocialLinks
            className='hidden flex-row items-center gap-x-5 text-3xl sm:flex lg:hidden'
            socials={game.socials}
            compact
          />
          <SocialLinks
            className='hidden flex-row items-center gap-x-5 text-3xl lg:flex'
            socials={game.socials}
          />
        </div>
        <Subscribers
          game={game}
          subscription={gameSubscription ?? undefined}
          subscriberCount={game._count.subscriptions}
          hasVerifiedEmail={user?.emailVerified}
          receiveEmails={user?.receiveEmails}
          loggedIn={!!user}
          data-superjson
        />
      </div>
      <div className='flex flex-col items-center gap-y-3'>
        <LinkButton
          className='flex md:hidden'
          href={game.website}
          icon={faGlobe}
          button={{ color: 'secondary' }}
          external
        >
          Website
        </LinkButton>
        <SocialLinks
          className='flex flex-row items-center gap-x-3 text-3xl sm:hidden'
          socials={game.socials}
          compact
        />
      </div>
    </div>
  )

  return (
    <>
      <div className='flex flex-col gap-y-3'>
        {gameHeader}
        <Projects
          projects={game.projects}
          game={game}
          favoritedProjectIds={favoritedProjectIds}
          loggedIn={!!user}
          subscriptions={projectSubscriptions}
          hasVerifiedEmail={user?.emailVerified}
          receiveEmails={user?.receiveEmails}
          data-superjson
        />
      </div>
    </>
  )
}

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

  return (
    <>
      <div className='flex flex-col gap-y-3'>
        <div className='flex flex-row flex-wrap items-center justify-center gap-x-8 gap-y-2 rounded-2xl bg-base-200 px-5 py-3 sm:justify-start'>
          <div className='mr-auto flex flex-row items-center gap-x-3'>
            <div className='relative h-12 w-12'>
              <Image
                className='object-contain'
                src={game.logoUrl}
                alt={`${game.name} logo`}
                fill
              />
            </div>
            <h1>{game.name}</h1>
          </div>
          <LinkButton
            href={game.website}
            icon={faGlobe}
            button={{ color: 'secondary' }}
            external
          >
            Website
          </LinkButton>
          <SocialLinks
            className='flex flex-row items-center gap-x-3 text-4xl md:hidden'
            socials={game.socials}
            compact
          />
          <SocialLinks
            className='hidden flex-row items-center gap-x-3 text-4xl md:flex'
            socials={game.socials}
          />
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

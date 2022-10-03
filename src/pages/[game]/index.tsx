import { Game, Project, Socials } from '@prisma/client'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import { db } from '@/server/db'
import { ProjectCard } from '@/components/game-project-card'
import { LinkButton } from '@/components/common/link-button'
import { SocialLinks } from '@/components/social-links'

type Props = {
  game: Game & {
    socials: Socials
    projects: (Project & { socials: Socials })[]
  }
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const key = context.query['game'] as string
  const game = await db.game.findUnique({
    where: { key },
    include: {
      socials: true,
      projects: {
        where: { published: true },
        include: { socials: true },
        orderBy: [
          {
            lastUpdate: 'desc',
          },
        ],
      },
    },
  })

  return game
    ? {
        props: { game },
      }
    : { notFound: true }
}

export default function GamePage({ game }: Props) {
  return (
    <>
      <Head>
        <title>{game.name}</title>
      </Head>
      <div className='flex flex-col gap-y-3'>
        <div className='flex flex-row items-center gap-x-8 gap-y-2 flex-wrap justify-center sm:justify-start bg-base-200 p-3 rounded-2xl'>
          <div className='flex flex-row items-center gap-x-3 mr-auto'>
            <img className='h-10' src={game.logoUrl} />
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
            className='flex md:hidden flex-row items-center gap-x-3 text-4xl'
            socials={game.socials}
            compact
          />
          <SocialLinks
            className='hidden md:flex flex-row items-center gap-x-3 text-4xl'
            socials={game.socials}
          />
        </div>
        {game.projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            game={game}
            socials={project.socials}
          />
        ))}
      </div>
    </>
  )
}

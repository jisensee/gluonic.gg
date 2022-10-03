import { Game, Project } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { Card } from 'react-daisyui'
import { faEdit, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import Head from 'next/head'
import { withUser } from '@/server/server-utils'
import { db } from '@/server/db'
import { LinkButton } from '@/components/common/link-button'
import { GameLink } from '@/components/common/game-link'

type Props = {
  projects: (Project & { game: Game })[]
}

export const getServerSideProps: GetServerSideProps<Props> = (context) =>
  withUser(context, async (user) => {
    const authorships = await db.projectAuthorships.findMany({
      where: { userId: user.id },
      include: { project: { include: { game: true } } },
    })
    const projects = authorships.map((authorship) => authorship.project)

    return { props: { projects } }
  })

export default function MyProjectsPage({ projects }: Props) {
  return (
    <div className='flex flex-col gap-y-3'>
      <Head>
        <title>My Projects</title>
      </Head>
      <h1>My Projects</h1>
      {projects.map((project) => (
        <Card
          key={project.id}
          className='flex flex-row items-center gap-x-5 gap-y-3 border-primary py-3 px-5 flex-wrap justify-center md:justify-start'
        >
          <div className='flex flex-col gap-y-1'>
            <h2>{project.name}</h2>
            <GameLink
              gameKey={project.game.key}
              name={project.game.name}
              logoUrl={project.game.logoUrl}
            />
          </div>
          <div className='hidden md:flex'>{project.abstract}</div>
          <div className='grow' />
          <LinkButton
            href={`/${project.game.key}/${project.key}`}
            icon={faMagnifyingGlass}
            button={{ color: 'secondary' }}
          >
            View
          </LinkButton>
          <LinkButton
            href={`/${project.game.key}/${project.key}/manage`}
            icon={faEdit}
            button={{ color: 'primary' }}
          >
            Manage
          </LinkButton>
        </Card>
      ))}
    </div>
  )
}

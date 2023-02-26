import type { Project, User } from '@prisma/client'
import { faEdit, faGlobe } from '@fortawesome/free-solid-svg-icons'
import { notFound } from 'next/navigation'
import { Subscribers } from './subscribers'
import { Favorites } from './favorites'
import { Posts } from './posts'
import { Description } from './description'
import { getProject, Params } from './data'
import { SocialLinks } from '@/components/social-links'
import { DonationButton } from '@/components/donation-button'
import { canUserManageProject, getUser } from '@/server/server-utils'
import { GameLink } from '@/components/common/game-link'
import { LinkButton } from '@/components/common/link-button'
import { UserLink } from '@/components/user-link'
import { prisma } from '@/server/db/client'
import { ProjectHeader } from '@/components/project-header'
import { NextPage } from '@/utils/next-types'

const projectVisible = async (project: Project, user?: User) => {
  if (project.published) {
    return true
  }
  if (user) {
    return canUserManageProject(project, user)
  }
  return false
}

const ProjectPage: NextPage<Params> = async ({
  params,
}: {
  params: Params
}) => {
  const user = await getUser()
  const project = await getProject(params.game, params.project)

  if (!project || !(await projectVisible(project, user))) {
    notFound()
  }

  const subscription = user
    ? await prisma.subscription.findFirst({
        where: {
          userId: user.id,
          projectId: project.id,
        },
      })
    : undefined

  const isFavorited = user
    ? await prisma.user
        .findUnique({
          where: { id: user.id },
          include: { favoritedProjects: { where: { id: project.id } } },
        })
        .then((r) => r?.favoritedProjects ?? [])
        .then((p) => p.length > 0)
    : false
  const canManage = user ? await canUserManageProject(project, user) : false
  const authors = project.projectAuthorships.map((a) => a.user)

  const header = (
    <div className='flex flex-col gap-y-2'>
      <div className='flex flex-row flex-wrap justify-between gap-3'>
        <ProjectHeader project={project} data-superjson />
        <div className='flex flex-row items-center gap-x-8'>
          <Subscribers
            loggedIn={!!user}
            project={project}
            subscription={subscription ?? undefined}
            subscriberCount={project._count.subscriptions}
            hasVerifiedEmail={user?.emailVerified}
            receiveEmails={user?.receiveEmails}
            data-superjson
          />
          <Favorites
            state={{
              count: project._count.favoritedBy,
              favorited: isFavorited,
            }}
            projectId={project.id}
            canFavorite={!!user}
          />
          {canManage && (
            <LinkButton
              href={`/influence/${project.key}/manage`}
              icon={faEdit}
              button={{ color: 'primary' }}
            >
              Manage
            </LinkButton>
          )}
        </div>
      </div>
      <GameLink
        className='self-start'
        gameKey={project.game.key}
        name={project.game.name}
        logoUrl={project.game.logoUrl}
      />
    </div>
  )
  const actions = (
    <div className='flex flex-row flex-wrap items-center justify-center gap-x-5 gap-y-2 xs:justify-start'>
      <LinkButton
        href={project.website}
        external
        button={{ color: 'secondary' }}
        icon={faGlobe}
      >
        Website
      </LinkButton>
      {project.donationAddress && (
        <DonationButton
          buttonProps={{ color: 'primary' }}
          targetAddress={project.donationAddress}
          modalTitle={`Donate to ${project.name}`}
          purposeText={<p>All donations go to 100% to the project.</p>}
        >
          Donate
        </DonationButton>
      )}
      <SocialLinks
        className='flex flex-row gap-x-5 text-4xl md:hidden'
        socials={project.socials}
        compact
      />
      <SocialLinks
        className='hidden flex-row gap-x-3 text-4xl md:flex'
        socials={project.socials}
      />
    </div>
  )
  const projectUrl = `/${project.game.key}/${project.key}`

  return (
    <div className='flex flex-col gap-y-2'>
      {header}
      {actions}
      <p className='text-lg'>{project.abstract}</p>
      {authors.length > 0 && (
        <h2>{authors.length > 1 ? 'Authors' : 'Author'}</h2>
      )}
      <div className='flex flex-row flex-wrap gap-3'>
        {authors.map((author) => (
          <UserLink key={author.id} id={author.id} name={author.name} />
        ))}
      </div>
      <div className='divider' />
      <div className='flex flex-col gap-3 md:flex-row'>
        {project.description && (
          <>
            <Description description={project.description} />
            <div className='divider divider-horizontal max-md:hidden' />
            <div className='divider md:hidden' />
          </>
        )}
        <div className='flex flex-col gap-y-3 md:w-1/3'>
          <Posts
            posts={project.posts}
            canCreatePost={canManage}
            projectUrl={projectUrl}
          />
        </div>
      </div>
    </div>
  )
}

export default ProjectPage

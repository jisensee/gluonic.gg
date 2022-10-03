import {
  faDiscord,
  faGithub,
  faTwitter,
  IconDefinition,
} from '@fortawesome/free-brands-svg-icons'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Socials } from '@prisma/client'
import { FC, ReactNode } from 'react'
import { Button } from 'react-daisyui'
import { Link } from './link'

type SocialLinksProps = {
  socials: Socials
  className?: string
  compact?: boolean
}

type SocialLinkProps = {
  icon: IconDefinition
  link?: string | null
  compact?: boolean
  text: ReactNode
}
const SocialLink: FC<SocialLinkProps> = ({ icon, link, compact, text }) =>
  link ? (
    <>
      {compact ? (
        <Link href={link} target='_blank'>
          <FontAwesomeIcon className='hover:text-primary' icon={icon} />
        </Link>
      ) : (
        <Link href={link} target='_blank'>
          <Button
            className='hover:bg-primary hover:text-primary-content'
            startIcon={<FontAwesomeIcon icon={icon} size='2x' />}
          >
            {text}
          </Button>
        </Link>
      )}
    </>
  ) : null

export const SocialLinks: FC<SocialLinksProps> = ({
  socials,
  className,
  compact,
}) => (
  <div className={className}>
    <SocialLink
      link={socials.website}
      icon={faGlobe}
      text='Website'
      compact={compact}
    />
    <SocialLink
      link={socials.twitter}
      icon={faTwitter}
      text='Twitter'
      compact={compact}
    />
    <SocialLink
      link={socials.discord}
      icon={faDiscord}
      text='Discord'
      compact={compact}
    />
    <SocialLink
      link={socials.github}
      icon={faGithub}
      text='Github'
      compact={compact}
    />
  </div>
)

'use client'

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
import { Tooltip, TooltipPosition } from './common/tooltip'
import { useCopyButton } from '@/hooks/misc-hooks'

const isUrl = (str: string) => {
  try {
    const url = new URL(str)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

type SocialLinksProps = {
  socials: Socials
  className?: string
  compact?: boolean
  tooltipPosition?: TooltipPosition
}

type SocialLinkProps = {
  icon: IconDefinition
  link: string
  compact?: boolean
  text: ReactNode
  tooltipPosition?: TooltipPosition
}
const SocialLink: FC<SocialLinkProps> = ({
  icon,
  link,
  compact,
  text,
  tooltipPosition,
}) => {
  const { onCopy, buttonText } = useCopyButton(link, 'Copied!')
  return isUrl(link) ? (
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
  ) : (
    <Tooltip
      content='Click to copy'
      className={'whitespace-nowrap text-sm'}
      position={tooltipPosition}
    >
      <Button
        className='hover:bg-primary hover:text-primary-content'
        startIcon={<FontAwesomeIcon icon={icon} size='2x' />}
        onClick={() => onCopy(link)}
      >
        {buttonText}
      </Button>
    </Tooltip>
  )
}

const correctHandle = (handle: string) =>
  handle.startsWith('@') ? handle.substring(1) : handle

const correctLink = (link: string, prefix: string) =>
  isUrl(link) ? link : prefix + correctHandle(link)

export const SocialLinks: FC<SocialLinksProps> = ({
  socials,
  className,
  compact,
  tooltipPosition,
}) => (
  <div className={className}>
    {socials.website && (
      <SocialLink
        link={socials.website}
        icon={faGlobe}
        text='Website'
        compact={compact}
        tooltipPosition={tooltipPosition}
      />
    )}
    {socials.twitter && (
      <SocialLink
        link={correctLink(socials.twitter, 'https://twitter.com/')}
        icon={faTwitter}
        text='Twitter'
        compact={compact}
        tooltipPosition={tooltipPosition}
      />
    )}
    {socials.discord && (
      <SocialLink
        link={socials.discord}
        icon={faDiscord}
        text='Discord'
        compact={compact}
        tooltipPosition={tooltipPosition}
      />
    )}
    {socials.github && (
      <SocialLink
        link={correctLink(socials.github, 'https://github.com/')}
        icon={faGithub}
        text='Github'
        compact={compact}
        tooltipPosition={tooltipPosition}
      />
    )}
  </div>
)

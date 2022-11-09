import { faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { FC } from 'react'
import { Divider } from 'react-daisyui'
import { DonationButton } from '../donation-button'
import { Link } from '../link'
import { LinkButton } from '../common/link-button'
import { GluonicData } from '@/gluonic.data'

const SocialButtons = () => (
  <div className='flex flex-row flex-wrap justify-center gap-x-5 gap-y-3'>
    <LinkButton
      href={GluonicData.discord}
      button={{
        startIcon: <FontAwesomeIcon icon={faDiscord} size='2x' />,
        className: 'hover:bg-primary hover:text-primary-content',
      }}
      external
    >
      Join us on discord
    </LinkButton>
    <LinkButton
      href={GluonicData.github}
      button={{
        startIcon: <FontAwesomeIcon icon={faGithub} size='2x' />,
        className: 'hover:bg-primary hover:text-primary-content',
      }}
      external
    >
      Check out the source code
    </LinkButton>
  </div>
)

const OtherLinks = () => (
  <div className='flex flex-col items-center gap-y-3'>
    <Link className='text-lg' href='/privacy-tos' highlight>
      Privacy and Terms of Service
    </Link>
  </div>
)

export type FooterProps = {
  className?: string
}
export const Footer: FC<FooterProps> = ({ className }) => (
  <div className={classNames('flex flex-col gap-y-3', className)}>
    <Divider />
    <SocialButtons />
    <div className='flex justify-center'>
      <DonationButton
        className='hover:bg-primary hover:text-primary-content'
        targetAddress={GluonicData.donationAddress}
        modalTitle='Donate to Gluonic'
        purposeText={
          <p>
            All donations will be used to keep Gluonic running and to fund
            further development.
          </p>
        }
      >
        Donate to Gluonic
      </DonationButton>
    </div>
    <OtherLinks />
  </div>
)

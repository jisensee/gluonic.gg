import { GetStaticProps } from 'next'

export const getStaticProps: GetStaticProps = async () => ({ props: {} })

export default function TermsOfServicePage() {
  return (
    <div className='prose prose-headings:text-primary'>
      <h1>Terms of service and privacy</h1>
      <p>
        By using this website you agree to the terms and conditions outlined
        below.
      </p>
      <p className='font-bold text-primary'>
        Gluonic does not actively collect any personal information!
      </p>
      <p>
        If you sign into the application with your Ethereum wallet, we store the
        following pieces of information:
      </p>
      <ul>
        <li>
          Your Ethereum address that you signed in with. This is needed to store
          any further information that you wish to save in your account.
        </li>
        <li>
          Any data that you explicitly enter into your profile (social media
          links, etc.)
        </li>
        <li>The date and time at which you created your account.</li>
        <li>
          The date and time at which you took certain actions in the
          application, like editing a project.
        </li>
      </ul>
      <span className='font-bold'>
        None of this data is ever shared with third parties.
      </span>

      <h2>Disclaimer</h2>
      <p>
        All the materials on Gluonic’s Website are provided &quot;as is&quot;. Gluonic
        makes no warranties, may it be expressed or implied, therefore negates
        all other warranties. Furthermore, Gluonic does not make any
        representations concerning the accuracy or reliability of the use of the
        materials on its Website or otherwise relating to such materials or any
        sites linked to this Website.
      </p>

      <h2> Limitations</h2>
      <p>
        Gluonic or its suppliers will not be hold accountable for any damages
        that will arise with the use or inability to use the materials on
        Gluonic’s Website, even if Gluonic or an authorize representative of
        this Website has been notified, orally or written, of the possibility of
        such damage. Some jurisdiction does not allow limitations on implied
        warranties or limitations of liability for incidental damages, these
        limitations may not apply to you.
      </p>

      <h2>Revisions and Errata</h2>
      <p>
        The materials appearing on Gluonic’s Website may include technical,
        typographical, or photographic errors. Gluonic will not promise that any
        of the materials in this Website are accurate, complete, or current.
        Gluonic may change the materials contained on its Website at any time
        without notice. Gluonic does not make any commitment to update the
        materials.
      </p>

      <h2>Links</h2>
      <p>
        Gluonic has not reviewed all of the sites linked to its Website and is
        not responsible for the contents of any such linked site. The presence
        of any link does not imply endorsement by Gluonic of the site. The use
        of any linked website is at the user’s own risk.
      </p>

      <h2>Site Terms of Use Modifications</h2>
      <p>
        Gluonic may revise these Terms of Use for its Website at any time
        without prior notice. By using this Website, you are agreeing to be
        bound by the current version of these Terms and Conditions of Use.
      </p>
    </div>
  )
}

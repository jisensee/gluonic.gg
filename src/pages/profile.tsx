import { GetServerSideProps } from 'next'

import { withUser } from '@/server/server-utils'

export const getServerSideProps: GetServerSideProps = (context) =>
  withUser(context, async (user) => ({
    redirect: { destination: `/users/${user.id}` },
    props: {},
  }))

export default function Redirect() {
  return null
}

import { NextApiRequest, NextApiResponse } from 'next'
import { CredentialInput } from 'next-auth/providers/credentials'
import CredentialsProvider from 'next-auth/providers/credentials'
import NextAuth from 'next-auth'
import { AuthService } from '@/server/auth-service'

type EthProviderCredentials = {
  message: CredentialInput
  signature: CredentialInput
}
const credentials: EthProviderCredentials = {
  message: {
    label: 'Message',
    type: 'text',
    placeholder: '0x0',
  },
  signature: {
    label: 'Signature',
    type: 'text',
    placeholder: '0x0',
  },
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const ethProvider = CredentialsProvider({
    name: 'Ethereum',
    credentials,
    authorize: (credentials) =>
      AuthService.signInUser(
        credentials?.message ?? '{}',
        credentials?.signature ?? '',
        req
      ),
  })

  const isDefaultSigninPage =
    req.method === 'GET' && (req.query.nextauth?.includes('signin') ?? false)

  return await NextAuth(req, res, {
    providers: isDefaultSigninPage ? [] : [ethProvider],
    session: {
      strategy: 'jwt',
    },
    secret: process.env.NETXAUTH_SECRET,
  })
}

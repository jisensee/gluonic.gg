import { NextApiRequest } from 'next/types'
import { CredentialInput } from 'next-auth/providers/credentials'
import CredentialsProvider from 'next-auth/providers/credentials'
import NextAuth from 'next-auth'
import { AuthService } from '@/server/auth-service'
import { env } from '@/env.mjs'

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

const ethProvider = CredentialsProvider({
  name: 'Ethereum',
  credentials,
  authorize: (credentials, req) =>
    AuthService.signInUser(
      credentials?.message ?? '{}',
      credentials?.signature ?? '',
      req as NextApiRequest
    ).then((user) =>
      user
        ? {
            id: user.id,
            name: user.name,
            email: user.id,
          }
        : null
    ),
})

const handler = NextAuth({
  providers: [ethProvider],
  session: {
    strategy: 'jwt',
  },
  secret: env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }

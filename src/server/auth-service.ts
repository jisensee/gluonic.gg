import { NextApiRequest } from 'next/types'
import { getToken } from 'next-auth/jwt'
import { SiweMessage } from 'siwe'
import { getCsrfToken } from 'next-auth/react'
import { UserService } from './user-service'
import { env } from '@/env.mjs'

const findUserFromRequest = (req: NextApiRequest) =>
  getToken({ req }).then((token) =>
    token?.email ? UserService.findById(token?.email) : undefined
  )

const buildNextAuthUrl = () => {
  if (env.NEXTAUTH_URL) {
    return env.NEXTAUTH_URL
  }
  if (env.VERCEL_URL) {
    return `https://${env.VERCEL_URL}`
  }
  return null
}

const signInUser = async (
  message: string,
  signature: string,
  req: NextApiRequest
) => {
  const nextAuthUrl = buildNextAuthUrl()
  if (!nextAuthUrl) {
    return
  }
  try {
    const siwe = new SiweMessage(JSON.parse(message ?? '{}'))

    const result = await siwe.verify({
      signature,
      domain: new URL(nextAuthUrl).host,
      nonce: await getCsrfToken({ req }),
    })

    if (result.success) {
      return await UserService.findOrCreate(siwe.address)
    }
    console.log('Sign in with Ethereum failed', result.error)
    return
  } catch (e) {
    console.error(
      'Auth error',
      {
        url: nextAuthUrl,
        vercelUrl: env.VERCEL_URL,
        nextAuthUrl: env.NEXTAUTH_URL,
      },
      e
    )
    return null
  }
}

export const AuthService = {
  findUserFromRequest,
  signInUser,
}

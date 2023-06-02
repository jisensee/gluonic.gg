import { NextApiRequest } from 'next/types'
import { getToken } from 'next-auth/jwt'
import { SiweMessage } from 'siwe'
import { getCsrfToken } from 'next-auth/react'
import { UserService } from './user-service'
import { getLogger } from './logger'
import { env } from '@/env.mjs'

const logger = getLogger('AuthService')

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
    logger.error('Could not build next auth url', {
      env: {
        nextAuthUrl: env.NEXTAUTH_URL,
        vercelUrl: env.VERCEL_URL,
      },
    })
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
      logger.info('Sign in with Ethereum success', {
        type: 'siweSuccess',
      })
      return await UserService.findOrCreate(siwe.address)
    }

    logger.error('Sign in with Ethereum failed', {
      type: 'siweError',
      error: result.error,
      address: siwe.address,
      url: nextAuthUrl,
    })

    return
  } catch (e) {
    logger.error('Unknown auth error', {
      error: e,
      type: 'authError',
      url: nextAuthUrl,
    })

    return null
  }
}

export const AuthService = {
  findUserFromRequest,
  signInUser,
}

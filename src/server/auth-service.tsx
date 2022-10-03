import { NextApiRequest } from 'next'
import { getToken } from 'next-auth/jwt'
import { SiweMessage } from 'siwe'
import { getCsrfToken } from 'next-auth/react'
import { UserService } from './user-service'
import { maybePromise } from '@/fp-utils'

const findUserFromRequest = (req: NextApiRequest) =>
  maybePromise(getToken({ req }))
    .map((jwt) => jwt.email ?? '')
    .chain(UserService.findById)

const signInUser = async (
  message: string,
  signature: string,
  req: NextApiRequest
) => {
  try {
    const siwe = new SiweMessage(JSON.parse(message ?? '{}'))
    const nextAuthUrl = process.env.NEXTAUTH_URL

    if (!nextAuthUrl) {
      return null
    }

    const nextAuthHost = new URL(nextAuthUrl).host
    if (siwe.domain !== nextAuthHost) {
      return null
    }

    if (siwe.nonce !== (await getCsrfToken({ req }))) {
      return null
    }
    await siwe.validate(signature)
    const user = await UserService.findOrCreate(siwe.address)

    return {
      email: user.id,
      name: user.name,
    }
  } catch (e) {
    return null
  }
}

export const AuthService = {
  findUserFromRequest,
  signInUser,
}

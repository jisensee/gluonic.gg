// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./src/env/server.mjs'))

import nextPwa from '@ducanh2912/next-pwa'
import { withSuperjson } from 'next-superjson'

const withPwa = nextPwa({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})

/** @type {import("next/types").NextConfig} */
const config = {
  experimental: {
    appDir: true,
    typedRoutes: true,
  },
}
// @ts-ignore
export default withSuperjson()(withPwa(config))

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./src/env.mjs'))

import nextPwa from '@ducanh2912/next-pwa'
import { withAxiom } from 'next-axiom'
import { env } from './src/env.mjs'

const withPwa = nextPwa({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})

/** @type {import("next/types").NextConfig} */
const config = {
  transpilePackages: ['react-daisyui'],
  reactStrictMode: true,
  experimental: {
    appDir: true,
    typedRoutes: true,
    swcPlugins: [['next-superjson-plugin', {}]],
    outputFileTracingExcludes: {
      '*': ['**swc/core**'],
    },
  },
  productionBrowserSourceMaps: true,
  images: {
    // @ts-ignore
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
      },
      {
        protocol: 'https',
        hostname: 'gluonic.gg',
      },
      env.VERCEL_URL
        ? {
            protocol: 'https',
            hostname: env.VERCEL_URL,
          }
        : undefined,
      env.NEXT_PUBLIC_NODE_ENV === 'development'
        ? {
            protocol: 'http',
            hostname: 'localhost',
          }
        : undefined,
    ].filter((p) => !!p),
  },
  webpack: (config, { isServer }) => {
    config.module = {
      ...config.module,
      // Suppress 'Critical dependency: the request of a dependency is an expression' warning for keyv
      exprContextCritical: false,
    }
    if (!isServer) {
      config.resolve.fallback.net = false
      config.resolve.fallback.tls = false
      config.resolve.fallback.fs = false
    }
    return config
  },
}

export default withAxiom(withPwa(config))

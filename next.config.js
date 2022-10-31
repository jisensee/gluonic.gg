const { withSuperjson } = require('next-superjson')
const withPwa = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = withSuperjson()(withPwa(nextConfig))

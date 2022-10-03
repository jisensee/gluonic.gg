declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXTAUTH_URL?: string
      VERCEL_URL?: string
      NEXTAUTH_SECRET: string
    }
  }
}

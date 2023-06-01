import { pino } from 'pino'
import { env } from '@/env.mjs'

export const getLogger = (name: string) =>
  pino({
    name,
    level: env.NODE_ENV === 'development' ? 'debug' : 'info',
    transport:
      env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
            },
          }
        : undefined,
  })

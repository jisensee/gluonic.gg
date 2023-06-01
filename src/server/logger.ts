import { log } from 'next-axiom'

export const getLogger = (context: string) => {
  return log.with({ context })
}

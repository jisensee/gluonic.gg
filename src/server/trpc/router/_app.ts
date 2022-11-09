import { router } from '../trpc'
import { postRouter } from './post'
import { projectRouter } from './project'
import { userRouter } from './user'

export const appRouter = router({
  user: userRouter,
  project: projectRouter,
  post: postRouter,
})

export type AppRouter = typeof appRouter

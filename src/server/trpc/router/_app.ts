import { router } from '../trpc'
import { postRouter } from './post'
import { projectRouter } from './project'
import { subscriptionRouter } from './subscription'
import { userRouter } from './user'

export const appRouter = router({
  user: userRouter,
  project: projectRouter,
  post: postRouter,
  subscription: subscriptionRouter,
})

export type AppRouter = typeof appRouter

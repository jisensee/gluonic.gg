import { z } from 'zod'

export const websiteInput = z.string().url().max(100)

export const ProjectInputs = {
  name: z.string().min(3).max(30),
  abstract: z.string().min(10).max(500),
  description: z.string().max(2000),
}

export const socialsInput = z.object({
  website: websiteInput.nullish(),
  twitter: z.string().max(80).nullish(),
  github: z.string().max(80).nullish(),
  discord: z.string().max(80).nullish(),
})

export const ProjectRouterInputs = {
  update: z.object({
    projectId: z.string(),
    abstract: ProjectInputs.abstract,
    description: ProjectInputs.description,
    website: websiteInput.min(1),
    published: z.boolean(),
    donationAddress: z.string().max(64),
    socials: socialsInput,
  }),
  request: z.object({
    name: ProjectInputs.name,
    abstract: ProjectInputs.abstract,
    website: websiteInput,
    gameId: z.string(),
  }),
  processRequest: z.object({
    requestId: z.string(),
    isAccepted: z.boolean(),
    projectKey: z.string().max(30).nullish(),
  }),
  toggleFavorite: z.object({
    projectId: z.string(),
  }),
}

export const UserRouterInputs = {
  updateOwn: z.object({
    name: z.string().max(25),
    bio: z.string().max(300),
    socials: socialsInput,
  }),
}

export const postDataInput = z.object({
  title: z.string().min(1).max(50),
  abstract: z.string().max(300),
  body: z.string().min(1).max(10000),
})

export const PostRouterInputs = {
  create: z.object({
    projectId: z.string().uuid(),
    post: postDataInput,
  }),
  edit: z.object({
    postId: z.string().uuid(),
    post: postDataInput,
  }),
}

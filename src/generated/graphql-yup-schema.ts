import * as yup from 'yup'
import { OwnUserUpdateInput, ProjectBaseDataInput, ProjectDonationInput, ProjectRequestInput, ProjectSocialsInput, ProjectUpdateInput, SocialsInput } from './graphql-resolver-types'

export function OwnUserUpdateInputSchema(): yup.SchemaOf<OwnUserUpdateInput> {
  return yup.object({
    bio: yup.string().max(300).label("Bio"),
    name: yup.string().max(25).label("Name"),
    socials: yup.lazy(() => SocialsInputSchema().defined()) as never
  })
}

export function ProjectBaseDataInputSchema(): yup.SchemaOf<ProjectBaseDataInput> {
  return yup.object({
    abstract: yup.string().required().max(500).label("Abstract"),
    description: yup.string().max(2000).label("Project description"),
    published: yup.boolean().defined(),
    website: yup.string().required().max(40).label("Website")
  })
}

export function ProjectDonationInputSchema(): yup.SchemaOf<ProjectDonationInput> {
  return yup.object({
    donationAddress: yup.string().max(64).label("Donation address")
  })
}

export function ProjectRequestInputSchema(): yup.SchemaOf<ProjectRequestInput> {
  return yup.object({
    abstract: yup.string().required().max(500).label("Project abstract"),
    gameId: yup.string().required(),
    name: yup.string().required().max(30).label("Project name"),
    website: yup.string().required().max(40).label("Project website")
  })
}

export function ProjectSocialsInputSchema(): yup.SchemaOf<ProjectSocialsInput> {
  return yup.object({
    discord: yup.string().max(40).label("Discord"),
    github: yup.string().max(80).label("Github"),
    twitter: yup.string().max(40).label("Twitter")
  })
}

export function ProjectUpdateInputSchema(): yup.SchemaOf<ProjectUpdateInput> {
  return yup.object({
    baseData: yup.lazy(() => ProjectBaseDataInputSchema()) as never,
    donationData: yup.lazy(() => ProjectDonationInputSchema()) as never,
    socials: yup.lazy(() => ProjectSocialsInputSchema()) as never
  })
}

export function SocialsInputSchema(): yup.SchemaOf<SocialsInput> {
  return yup.object({
    discord: yup.string().max(40).label("Discord"),
    github: yup.string().max(80).label("Github"),
    twitter: yup.string().max(40).label("Twitter"),
    website: yup.string().max(40).label("Website")
  })
}

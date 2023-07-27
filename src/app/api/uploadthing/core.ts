import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { NextApiRequest } from 'next'
import { z } from 'zod'
import { utapi } from 'uploadthing/server'
import { prisma } from '@/server/db/client'
import { AuthService } from '@/server/auth-service'
import { canUserManageProject } from '@/server/server-utils'
import { getLogger } from '@/server/logger'

const f = createUploadthing()

const logger = getLogger('UploadThing')

export const ourFileRouter = {
  projectLogo: f({ image: { maxFileSize: '1MB', maxFileCount: 1 } })
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .middleware(async ({ req, input }) => {
      const user = await AuthService.findUserFromRequest(
        req as unknown as NextApiRequest
      )

      if (!user) {
        throw new Error('Unauthorized')
      }

      const project = await prisma.project.findUnique({
        where: { id: input.projectId },
      })

      if (!project) {
        throw new Error('Project does not exist')
      }

      if (!canUserManageProject(project, user)) {
        throw new Error('No permission to manage this project')
      }

      return { projectId: project.id, previousLogoUrl: project.logoUrl }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        await prisma.project.update({
          where: { id: metadata.projectId },
          data: {
            logoUrl: file.url,
          },
        })
        logger.info('Uploaded new logo', {
          type: 'logoUpload',
          projectId: metadata.projectId,
        })
      } catch {
        logger.error('Failed to upload new logo')
      }
      if (metadata.previousLogoUrl) {
        const matches = /uploadthing\.com\/f\/(.*)/.exec(
          metadata.previousLogoUrl
        )
        const toDelete = matches ? matches[1] : null
        if (toDelete) {
          await utapi.deleteFiles(toDelete)
          logger.info('Deleted old logo', {
            type: 'oldLogoDelete',
            fileKey: toDelete,
          })
        }
      }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

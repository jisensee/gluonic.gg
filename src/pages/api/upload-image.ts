import { randomUUID } from 'crypto'
import { NextApiRequest, NextApiResponse } from 'next/types'
import nextConnect from 'next-connect'
import aws from 'aws-sdk'
import multer from 'multer'
import { prisma } from '@/server/db/client'
import { AuthService } from '@/server/auth-service'
import { canUserManageProject } from '@/server/server-utils'
import { env } from '@/env.mjs'

const s3AccessKey = env.S3_ACCESS_KEY ?? ''
const s3SecretKey = env.S3_SECRET_KEY ?? ''
const s3Endpoint = env.S3_ENDPOINT ?? ''
const s3Bucket = env.S3_BUCKET ?? ''

const s3 = new aws.S3({
  credentials: { accessKeyId: s3AccessKey, secretAccessKey: s3SecretKey },
  endpoint: s3Endpoint,
})

const allowedFileTypes = ['image/png', 'image/svg+xml']

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_, file, callback) =>
    callback(null, allowedFileTypes.includes(file.mimetype)),
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
})
const apiRoute = nextConnect({})

const uploadMiddleware = upload.single('logo')
apiRoute.use(uploadMiddleware)

type MulterFile = {
  fieldname: string
  mimetype: string
  buffer: Buffer
}
type MulterRequest = NextApiRequest & {
  body: Record<string, string>
  file: MulterFile
}

const deleteOldLogo = async (oldLogoUrl: string) => {
  const index = oldLogoUrl.indexOf('project-logo')
  const key = oldLogoUrl.slice(index)
  try {
    await s3.deleteObject({ Bucket: s3Bucket, Key: key }).promise()
    return true
  } catch {
    return false
  }
}

apiRoute.post(async (req: MulterRequest, res: NextApiResponse) => {
  const user = await AuthService.findUserFromRequest(req)
  if (!user) {
    return res.status(401)
  }
  const projectId = req.body['projectId']
  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) {
    return res.status(404)
  }
  const canManage = await canUserManageProject(project, user)
  if (!canManage) {
    return res.status(401)
  }

  try {
    const prevLogoUrl = project.logoUrl
    const result = await s3
      .upload({
        Bucket: s3Bucket,
        ACL: 'public-read',
        Key: `project-logo-${project.key}-${randomUUID()}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
      .promise()
    await prisma.project.update({
      data: { logoUrl: result.Location },
      where: { id: projectId },
    })
    if (prevLogoUrl) {
      await deleteOldLogo(prevLogoUrl)
    }
    return res.status(200).json({ url: result.Location })
  } catch (error) {
    return res.status(500)
  }
})

export default apiRoute

export const config = {
  api: {
    bodyParser: false,
  },
}

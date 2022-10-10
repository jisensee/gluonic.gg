import { useMutation } from '@tanstack/react-query'

export type ImageUploadResult = {
  url: string
}

type ImageUploadParams = {
  image: File
  projectId: string
}

export const useImageUpload = () =>
  useMutation<ImageUploadResult, unknown, ImageUploadParams>((params) => {
    const data = new FormData()
    data.append('logo', params.image)
    data.append('projectId', params.projectId)

    return fetch('/api/upload-image', {
      method: 'POST',
      body: data,
    }).then((res) => {
      if (!res.ok) {
        throw new Error('Upload failed')
      }
      return res.json() as Promise<ImageUploadResult>
    })
  })

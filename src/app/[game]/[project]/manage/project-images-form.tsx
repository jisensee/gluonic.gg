import type { FC } from 'react'
import { generateReactHelpers } from '@uploadthing/react/hooks'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from 'react-daisyui'
import { useForm } from 'react-hook-form'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { useToast } from '@/context/toast-context'
import { OurFileRouter } from '@/app/api/uploadthing/core'

export type ProjectImagesFormData = {
  logoUrl?: string
}

type FormState = {
  logo?: FileList
}

export type ProjectImagesFormProps = {
  className?: string
  projectId: string
  initialData: ProjectImagesFormData
}

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

export const ProjectImagesForm: FC<ProjectImagesFormProps> = ({
  className,
  projectId,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid, errors },
  } = useForm<FormState>({ reValidateMode: 'onChange', mode: 'all' })

  const [logoUrl, setLogoUrl] = useState(initialData.logoUrl)

  const { showToast } = useToast()

  const { isUploading, startUpload } = useUploadThing('projectLogo', {
    onClientUploadComplete: (res) => {
      const newLogoUrl = res?.[0]?.fileUrl
      if (newLogoUrl) {
        showToast({ status: 'success', title: 'Logo has been updated!' })
        setLogoUrl(newLogoUrl)
      }
    },
    onUploadError: () =>
      showToast({ status: 'error', title: 'Logo upload failed!' }),
  })

  const onSubmit = (data: FormState) => {
    const image = data.logo?.[0]
    if (image) {
      startUpload([image], { projectId })
    }
  }

  return (
    <form
      className={classNames('flex flex-col gap-y-3', className)}
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2>Upload logo</h2>

      <p>Set a new logo for your project.</p>
      <div className='flex flex-row items-center gap-x-3'>
        {logoUrl && (
          <div className='relative h-20 w-20'>
            <Image className='object-contain' src={logoUrl} alt='logo' fill />
          </div>
        )}
        <div className='flex flex-col gap-y-2'>
          <input
            className='rounded-xl bg-neutral py-0 pl-0 pr-5 file:mr-5 file:cursor-pointer file:rounded-xl file:border-0 file:bg-primary file:px-5 file:py-3 file:hover:bg-primary-focus'
            type='file'
            {...register('logo', {
              validate: {
                fileSelected: (fl) => {
                  return fl?.length === 1 ? undefined : 'File is required'
                },
                correctType: (fl) => {
                  return fl?.item(0)?.type?.startsWith('image/') ?? true
                    ? undefined
                    : 'Please select an image file'
                },
                maxSize: (fl) => {
                  const size = fl?.item(0)?.size
                  return size && size > 1 * 1024 * 1024
                    ? 'File needs to be 1MB or smaller'
                    : undefined
                },
              },
            })}
            accept='image/*'
          />
          {errors['logo']?.message && (
            <span className='text-error'>{errors['logo'].message}</span>
          )}
        </div>
      </div>
      <span className='italic'>
        Please make sure that your logo is somewhat square so it looks good
        everywhere.
      </span>
      <Button
        className='mt-2 w-full md:w-52'
        color='primary'
        type='submit'
        disabled={!isDirty || !isValid}
        loading={isUploading}
        startIcon={<FontAwesomeIcon icon={faUpload} />}
      >
        Upload
      </Button>
    </form>
  )
}

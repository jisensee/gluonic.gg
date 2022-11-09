import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { Button } from 'react-daisyui'
import { useForm } from 'react-hook-form'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { useImageUpload } from '@/hooks/image-upload-hooks'
import { useToast } from '@/context/toast-context'

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

  const { mutate, isLoading, data, error } = useImageUpload()
  const { showToast } = useToast()

  useEffect(() => {
    if (error) {
      showToast({ status: 'error', title: 'Logo upload failed!' })
    } else if (data) {
      showToast({ status: 'success', title: 'Logo has been updated!' })
      setLogoUrl(data.url)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error])

  const onSubmit = (data: FormState) => {
    const image = data.logo?.[0]
    if (image) {
      mutate({ image, projectId })
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
        {logoUrl && <img className='h-20' src={logoUrl} alt='logo' />}
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
                  return ['image/png', 'image/svg+xml'].includes(
                    fl?.item(0)?.type ?? ''
                  )
                    ? undefined
                    : 'Filetype is not supported'
                },
                maxSize: (fl) => {
                  const size = fl?.item(0)?.size
                  return size && size > 3 * 1024 * 1024
                    ? 'File needs to be 3MB or smaller'
                    : undefined
                },
              },
            })}
            accept='.svg,.png'
          />
          {errors['logo']?.message && (
            <span className='text-error'>{errors['logo'].message}</span>
          )}
        </div>
      </div>
      <Button
        className='mt-2 w-full md:w-52'
        color='primary'
        type='submit'
        disabled={!isDirty || !isValid}
        loading={isLoading}
        startIcon={<FontAwesomeIcon icon={faUpload} />}
      >
        Upload
      </Button>
    </form>
  )
}

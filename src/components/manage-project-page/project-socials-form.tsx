import {
  faTwitter,
  faGithub,
  faDiscord,
} from '@fortawesome/free-brands-svg-icons'
import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import { FC } from 'react'
import { Input } from 'react-daisyui'
import { useForm } from 'react-hook-form'
import { FormField, IconInput, errorColor, SaveButton } from '../common/form'
import { ProjectSocialsInputSchema } from '@/generated/graphql-yup-schema'
import {
  ProjectSocialsInput,
  useUpdateProjectMutation,
} from '@/generated/graphql-hooks'
import { useStatusToast, mutationToToastStatus } from '@/context/toast-context'

export type ProjectSocialsFormProps = {
  className?: string
  projectId: string
  initialData: ProjectSocialsInput
}
export const ProjectSocialsForm: FC<ProjectSocialsFormProps> = ({
  className,
  projectId,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: initialData,
    resolver: yupResolver(ProjectSocialsInputSchema()),
    mode: 'onChange',
  })
  const { mutate, status } = useUpdateProjectMutation()
  const onSubmit = (data: ProjectSocialsInput) =>
    mutate({
      projectId,
      data: {
        socials: data,
      },
    })

  useStatusToast(mutationToToastStatus(status), {
    success: {
      title: 'Project socials successfully saved!',
    },
    error: { title: 'Could not save socials!' },
  })

  return (
    <div className={classNames('flex flex-col gap-y-3', className)}>
      <h2>Socials</h2>
      <form
        className='flex flex-col gap-y-3 responsive-form'
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormField label='Twitter' error={errors['twitter']}>
          <IconInput icon={faTwitter}>
            <Input
              {...register('twitter')}
              className='w-full'
              color={errorColor(errors['twitter'])}
            />
          </IconInput>
        </FormField>
        <FormField label='Github' error={errors['github']}>
          <IconInput icon={faGithub}>
            <Input
              {...register('github')}
              className='w-full'
              color={errorColor(errors['github'])}
            />
          </IconInput>
        </FormField>
        <FormField label='Discord' error={errors['discord']}>
          <IconInput icon={faDiscord}>
            <Input
              {...register('discord')}
              className='w-full'
              color={errorColor(errors['discord'])}
            />
          </IconInput>
        </FormField>
        <SaveButton
          className='mt-2'
          type='submit'
          disabled={!isValid}
          loading={status === 'loading'}
        />
      </form>
    </div>
  )
}

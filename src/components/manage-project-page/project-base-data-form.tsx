import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import { FC } from 'react'
import { Toggle, Input, Textarea } from 'react-daisyui'
import { useForm, Controller } from 'react-hook-form'
import { FormField, errorColor, SaveButton } from '../common/form'
import { Markdown } from '../markdown'
import { ProjectBaseDataInputSchema } from '@/generated/graphql-yup-schema'
import {
  ProjectBaseDataInput,
  useUpdateProjectMutation,
} from '@/generated/graphql-hooks'
import { mutationToToastStatus, useStatusToast } from '@/context/toast-context'

export type ProjectBaseDataFormProps = {
  className?: string
  initialData: ProjectBaseDataInput
  projectId: string
}
export const ProjectBaseDataForm: FC<ProjectBaseDataFormProps> = ({
  className,
  initialData,
  projectId,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: initialData,
    resolver: yupResolver(ProjectBaseDataInputSchema()),
    mode: 'onChange',
  })
  const { mutate, status } = useUpdateProjectMutation()
  const onSubmit = (data: ProjectBaseDataInput) =>
    mutate({
      projectId,
      data: { baseData: data },
    })

  useStatusToast(mutationToToastStatus(status), {
    success: {
      title: 'Project data successfully saved!',
    },
    error: { title: 'Could not save project data!' },
  })

  return (
    <div className={classNames('flex flex-col gap-y-3', className)}>
      <h2>Project data</h2>

      <form className='flex flex-col gap-y-3' onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label='Published'
          infoMessage='Published projects will be viewable to all users. Disabled this if you want to hide your project for a bit.'
        >
          <Toggle {...register('published')} color='primary' />
        </FormField>
        <FormField
          className='responsive-form'
          label='Website'
          error={errors['website']}
        >
          <Input
            {...register('website')}
            color={errorColor(errors['website'])}
          />
        </FormField>
        <FormField
          className='responsive-form'
          label='Abstract'
          error={errors['abstract']}
          infoMessage='Write a few lines about your project. This will be shown in all kind of lists as preview, so keep it short and memorable!'
        >
          <Textarea
            {...register('abstract')}
            color={errorColor(errors['abstract'])}
          />
        </FormField>
        <FormField label='Description' error={errors['description']}>
          <Controller
            control={control}
            name='description'
            render={(p) => (
              <Markdown.Editor
                text={p.field.value ?? ''}
                onTextChange={p.field.onChange}
              />
            )}
          />
        </FormField>
        <SaveButton
          className='mt-2'
          type='submit'
          loading={status === 'loading'}
          disabled={!isValid}
        />
      </form>
    </div>
  )
}

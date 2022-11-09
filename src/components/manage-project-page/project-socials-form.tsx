import {
  faTwitter,
  faGithub,
  faDiscord,
} from '@fortawesome/free-brands-svg-icons'
import classNames from 'classnames'
import { FC } from 'react'
import { Input } from 'react-daisyui'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormField, IconInput, errorColor, SaveButton } from '../common/form'
import { useStatusToast, mutationToToastStatus } from '@/context/toast-context'
import { ProjectRouterInputs } from '@/utils/trpc-inputs'
import { trpc } from '@/utils/trpc'

type UpdateData = z.infer<typeof ProjectRouterInputs.update>

export type ProjectSocialsFormProps = {
  className?: string
  initialData: UpdateData
}
export const ProjectSocialsForm: FC<ProjectSocialsFormProps> = ({
  className,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: initialData,
    resolver: zodResolver(ProjectRouterInputs.update),
    mode: 'onChange',
  })
  const { mutate, status } = trpc.project.update.useMutation()

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
        className='responsive-form flex flex-col gap-y-3'
        onSubmit={handleSubmit((d) => mutate(d))}
      >
        <FormField label='Twitter' error={errors.socials?.twitter}>
          <IconInput icon={faTwitter}>
            <Input
              {...register('socials.twitter')}
              className='w-full'
              color={errorColor(errors.socials?.twitter)}
            />
          </IconInput>
        </FormField>
        <FormField label='Github' error={errors.socials?.github}>
          <IconInput icon={faGithub}>
            <Input
              {...register('socials.github')}
              className='w-full'
              color={errorColor(errors.socials?.github)}
            />
          </IconInput>
        </FormField>
        <FormField label='Discord' error={errors.socials?.discord}>
          <IconInput icon={faDiscord}>
            <Input
              {...register('socials.discord')}
              className='w-full'
              color={errorColor(errors.socials?.discord)}
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

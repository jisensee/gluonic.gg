import type { FC } from 'react'
import { useEffect } from 'react'
import { Input, Textarea } from 'react-daisyui'
import { useForm } from 'react-hook-form'
import { faGlobe, faUser } from '@fortawesome/free-solid-svg-icons'
import {
  faDiscord,
  faGithub,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons'
import type { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthContext } from '@/context/auth-context'
import {
  errorColor,
  FormField,
  IconInput,
  SaveButton,
} from '@/components/common/form'
import { LinkButton } from '@/components/common/link-button'
import { useDynamicDocumentTitle } from '@/hooks/misc-hooks'
import { mutationToToastStatus, useStatusToast } from '@/context/toast-context'
import { UserRouterInputs } from '@/utils/trpc-inputs'
import { trpc } from '@/utils/trpc'

type UpdateData = z.infer<typeof UserRouterInputs.updateOwn>

type DataFormProps = {
  initialData: UpdateData
  hasDefaultName: boolean
  onSubmit: (data: UpdateData) => void
  loading: boolean
}
const UserDataForm: FC<DataFormProps> = ({
  initialData,
  hasDefaultName,
  onSubmit,
  loading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: initialData,
    resolver: zodResolver(UserRouterInputs.updateOwn),
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  return (
    <>
      <div className='flex flex-row items-center'>
        <h1 className='grow'>Edit profile data</h1>
        <LinkButton href='/profile' icon={faUser} button={{ color: 'primary' }}>
          View profile
        </LinkButton>
      </div>
      <p>
        This data will only be publicly visible if you are a project author. At
        the moment there is no need to fill this out as a normal user.
      </p>
      <form
        className='responsive-form mt-2 flex flex-col gap-y-3'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <h3>Your basic data</h3>
          <div className='flex flex-col gap-y-3'>
            <FormField
              label='Username'
              infoMessage={
                hasDefaultName &&
                'Set your username here. If none provided, your address will be used instead.'
              }
              error={errors['name']}
            >
              <Input
                {...register('name')}
                className='w-full'
                color={errorColor(errors['name'])}
              />
            </FormField>
            <FormField label='Bio' error={errors['bio']}>
              <Textarea
                {...register('bio')}
                className='w-full'
                color={errorColor(errors['bio'])}
              />
            </FormField>
          </div>
        </div>
        <div>
          <h3>Where do we find you?</h3>
          <div className='flex flex-col gap-y-3'>
            <FormField label='Website' error={errors['socials']?.website}>
              <IconInput icon={faGlobe}>
                <Input
                  {...register('socials.website')}
                  className='w-full'
                  color={errorColor(errors['socials']?.website)}
                />
              </IconInput>
            </FormField>
            <FormField label='Twitter' error={errors['socials']?.twitter}>
              <IconInput icon={faTwitter}>
                <Input
                  {...register('socials.twitter')}
                  className='w-full'
                  color={errorColor(errors['socials']?.twitter)}
                />
              </IconInput>
            </FormField>
            <FormField label='Github' error={errors['socials']?.github}>
              <IconInput icon={faGithub}>
                <Input
                  {...register('socials.github')}
                  className='w-full'
                  color={errorColor(errors['socials']?.github)}
                />
              </IconInput>
            </FormField>
            <FormField label='Discord' error={errors['socials']?.discord}>
              <IconInput icon={faDiscord}>
                <Input
                  {...register('socials.discord')}
                  className='w-full'
                  color={errorColor(errors['socials']?.discord)}
                />
              </IconInput>
            </FormField>
          </div>
        </div>
        <SaveButton
          className='mt-2'
          type='submit'
          loading={loading}
          disabled={!isValid}
        />
      </form>
    </>
  )
}

export default function UserEditPage() {
  const { mutate, data, status } = trpc.user.updateOwn.useMutation()
  const { user, updateUser } = useAuthContext()

  useDynamicDocumentTitle(user?.name ?? 'Profile')

  useStatusToast(mutationToToastStatus(status), {
    success: { title: 'Profile successfully saved!' },
    error: { title: 'Could not save profile data!' },
  })

  useEffect(() => {
    if (data && user && data.name !== user.name) {
      updateUser(data)
    }
  }, [data, updateUser, user])

  return user ? (
    <UserDataForm
      initialData={{
        name: user.name ?? '',
        bio: user.bio ?? '',
        socials: {
          discord: user.socials.discord,
          github: user.socials.github,
          twitter: user.socials.twitter,
          website: user.socials.website,
        },
      }}
      loading={status === 'loading'}
      hasDefaultName={user.address === user.name}
      onSubmit={(data) => mutate(data)}
    />
  ) : null
}

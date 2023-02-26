'use client'

import type { FC } from 'react'
import { Button, Input, Textarea, Toggle } from 'react-daisyui'
import { useForm } from 'react-hook-form'
import {
  faCheck,
  faGlobe,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons'
import {
  faDiscord,
  faGithub,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons'
import type { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  errorColor,
  FormField,
  IconInput,
  SaveButton,
} from '@/components/common/form'
import { UserRouterInputs } from '@/utils/trpc-inputs'
import { trpc } from '@/utils/trpc'
import { mutationToToastStatus, useStatusToast } from '@/context/toast-context'

type UpdateData = z.infer<typeof UserRouterInputs.updateOwn>

type DataFormProps = {
  initialData: UpdateData
  hasDefaultName: boolean
  emailVerified: boolean
}
export const UserDataForm: FC<DataFormProps> = ({
  initialData,
  hasDefaultName,
  emailVerified,
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
  const { mutate, status, data } = trpc.user.updateOwn.useMutation()
  const {
    mutate: resendVerificationEmail,
    status: resendVerificationMailStatus,
  } = trpc.user.resendVerificationEmail.useMutation()
  const onSubmit = handleSubmit((d) => mutate(d))
  const loading = status === 'loading'

  useStatusToast(mutationToToastStatus(resendVerificationMailStatus), {
    success: {
      title: 'Verification email sent.',
    },
    error: {
      title: 'Could not send verification email.',
    },
  })

  useStatusToast(mutationToToastStatus(status), {
    success: {
      title: 'Profile successfully saved!',
      message: data?.emailVerificationStarted
        ? `A verification email has been sent to your address. Please follow it's instructions to verify your email.`
        : undefined,
    },
    error: { title: 'Could not save profile data!' },
  })

  const emailVerifiedText = (
    <span className='flex flex-row items-center gap-x-2 text-success'>
      <FontAwesomeIcon icon={faCheck} />
      Verified
    </span>
  )
  const emailNotVerifiedText = (
    <span className='flex flex-row items-center gap-x-2 text-error'>
      <FontAwesomeIcon icon={faTimesCircle} />
      Not verified
    </span>
  )

  const emailLabelSuffix = () => {
    if (data?.emailVerificationStarted) {
      return emailNotVerifiedText
    }
    if (emailVerified) {
      return emailVerifiedText
    }
    if (initialData.email && initialData.email !== '') {
      return emailNotVerifiedText
    }
    return null
  }
  const emailLabel = (
    <div className='flex w-full flex-row justify-between gap-x-3'>
      <span>Email</span>
      {emailLabelSuffix()}
    </div>
  )

  return (
    <>
      <form
        className='responsive-form mt-2 flex flex-col gap-y-3'
        onSubmit={onSubmit}
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
            <FormField
              label={emailLabel}
              error={errors['email']}
              infoMessage='Your email will only be used to send you notifications that you opted into explicitly. It will never be visible for others.'
            >
              <Input
                {...register('email')}
                className='w-full'
                color={errorColor(errors['email'])}
              />
            </FormField>
            {emailVerified && (
              <FormField
                label='Receive emails'
                infoMessage='Turn this off to not receive any emails regardless of your subscriptions.'
              >
                <Toggle {...register('receiveEmails')} color='primary' />
              </FormField>
            )}
            {!emailVerified && initialData.email && (
              <Button
                type='button'
                loading={resendVerificationMailStatus === 'loading'}
                color='primary'
                onClick={() => resendVerificationEmail()}
              >
                Resend verification email
              </Button>
            )}
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

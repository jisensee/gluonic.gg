import { isAddress } from 'ethers/lib/utils'
import { FC } from 'react'
import { Input } from 'react-daisyui'
import { useForm } from 'react-hook-form'
import classNames from 'classnames'
import { FormField, errorColor, SaveButton } from '../common/form'
import {
  InputMaybe,
  ProjectDonationInput,
  useUpdateProjectMutation,
} from '@/generated/graphql-hooks'
import { useStatusToast, mutationToToastStatus } from '@/context/toast-context'

export type ProjectDonationsFormProps = {
  className?: string
  projectId: string
  initialData: ProjectDonationInput
}
export const ProjectDonationsForm: FC<ProjectDonationsFormProps> = ({
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
    mode: 'onChange',
  })

  const { mutate, status } = useUpdateProjectMutation()
  useStatusToast(mutationToToastStatus(status), {
    success: {
      title: 'Donation data successfully saved!',
    },
    error: { title: 'Could not save donation data!' },
  })

  const onSubmit = (data: ProjectDonationInput) =>
    mutate({ data: { donationData: data }, projectId })

  const validateAddress = (address: InputMaybe<string>) => {
    if (address && !isAddress(address)) {
      return 'Please enter a valid Ethereum address'
    }
  }

  return (
    <div className={classNames('flex flex-col gap-y-3', className)}>
      <h2>Donations</h2>
      <form
        className='flex flex-col gap-y-3 responsive-form'
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormField
          label='Donation address'
          error={errors['donationAddress']}
          infoMessage='Add an Ethereum mainnet address that users can send donations to. This should be an address that is exclusively used for receiving donations to enable aggregating stats in a future update.'
        >
          <Input
            {...register('donationAddress', { validate: validateAddress })}
            color={errorColor(errors['donationAddress'])}
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

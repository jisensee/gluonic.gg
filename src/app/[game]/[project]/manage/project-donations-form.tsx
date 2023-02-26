import { FC } from 'react'
import { Input } from 'react-daisyui'
import { useForm } from 'react-hook-form'
import classNames from 'classnames'
import { z } from 'zod'
import { isAddress } from 'viem'
import { FormField, errorColor, SaveButton } from '@/components/common/form'
import { useStatusToast, mutationToToastStatus } from '@/context/toast-context'
import { trpc } from '@/utils/trpc'
import { ProjectRouterInputs } from '@/utils/trpc-inputs'

type UpdateData = z.infer<typeof ProjectRouterInputs.update>

export type ProjectDonationsFormProps = {
  className?: string
  initialData: UpdateData
}
export const ProjectDonationsForm: FC<ProjectDonationsFormProps> = ({
  className,
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

  const { mutate, status } = trpc.project.update.useMutation()
  useStatusToast(mutationToToastStatus(status), {
    success: {
      title: 'Donation data successfully saved!',
    },
    error: { title: 'Could not save donation data!' },
  })

  const validateAddress = (address: string | null | undefined) => {
    if (address && !isAddress(address)) {
      return 'Please enter a valid Ethereum address'
    }
  }

  return (
    <div className={classNames('flex flex-col gap-y-3', className)}>
      <h2>Donations</h2>
      <form
        className='responsive-form flex flex-col gap-y-3'
        onSubmit={handleSubmit((d) => mutate(d))}
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

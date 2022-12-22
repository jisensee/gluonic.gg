'use client'

import { Game } from '@prisma/client'
import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select, Textarea } from 'react-daisyui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { FormField } from '@/components/common/form'
import { ProjectRouterInputs } from '@/utils/trpc-inputs'
import { trpc } from '@/utils/trpc'

type FormState = z.infer<typeof ProjectRouterInputs.request>

type ProjectRequestFormProps = {
  games: Game[]
}

export const ProjectRequestForm: FC<ProjectRequestFormProps> = ({ games }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormState>({
    resolver: zodResolver(ProjectRouterInputs.request),
    mode: 'onChange',
    reValidateMode: 'onChange',
  })
  const { mutate: submitRequest, status } = trpc.project.request.useMutation()
  const router = useRouter()

  useEffect(() => {
    if (status === 'success') {
      router.push('/request-project/success')
    }
  }, [status, router])

  return (
    <form
      className='responsive-form flex flex-col gap-y-3'
      onSubmit={handleSubmit((data) => submitRequest(data))}
    >
      <FormField
        label='Project name'
        error={errors['name']}
        infoMessage='The name of your project as it should be displayed to others'
      >
        <Input {...register('name')} />
      </FormField>
      <FormField
        label='Project abstract'
        error={errors['abstract']}
        infoMessage={`A short description of your project. Don't worry, you will be able to change this later.`}
      >
        <Textarea {...register('abstract')} />
      </FormField>
      <FormField
        label='Project website'
        error={errors['website']}
        infoMessage='Where do we find your project?'
      >
        <Input {...register('website')} />
      </FormField>
      <FormField label='Game'>
        <Select {...register('gameId')}>
          {games.map((game) => (
            <Select.Option key={game.id} value={game.id}>
              {game.name}
            </Select.Option>
          ))}
        </Select>
      </FormField>

      <Button
        className='mt-2'
        color='primary'
        type='submit'
        startIcon={<FontAwesomeIcon icon={faEnvelope} />}
        disabled={!isValid}
        loading={status === 'success' || status === 'loading'}
      >
        Submit project
      </Button>
    </form>
  )
}

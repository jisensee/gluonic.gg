import { Game } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Input, Select } from 'react-daisyui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { FormField } from '@/components/common/form'
import { ProjectRequestInputSchema } from '@/generated/graphql-yup-schema'
import {
  ProjectRequestInput,
  useRequestProjectMutation,
} from '@/generated/graphql-hooks'
import { db } from '@/server/db'
import { withOptionalUser } from '@/server/server-utils'

type Props = {
  games?: Game[]
}

export const getServerSideProps: GetServerSideProps<Props> = (context) =>
  withOptionalUser(context, async (user) => {
    if (user.isNothing()) {
      return Promise.resolve({ props: {} })
    }

    const games = await db.game.findMany()
    return { props: { games } }
  })

type ProjectRequestFormProps = {
  onSubmit: (data: ProjectRequestInput) => void
  games: Game[]
  loading: boolean
}
const ProjectRequestForm: FC<ProjectRequestFormProps> = ({
  onSubmit,
  games,
  loading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ProjectRequestInput>({
    resolver: yupResolver(ProjectRequestInputSchema()),
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  return (
    <form
      className='flex flex-col gap-y-3 responsive-form'
      onSubmit={handleSubmit(onSubmit)}
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
        <Input {...register('abstract')} />
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
        loading={loading}
      >
        Submit project
      </Button>
    </form>
  )
}

export default function RequestProjectPage({ games }: Props) {
  const { mutateAsync: submitRequest, status } = useRequestProjectMutation()
  const { push } = useRouter()

  return (
    <div className='flex flex-col gap-y-3'>
      <Head>
        <title>Request project</title>
      </Head>
      <h1>Request project</h1>
      {games === undefined ? (
        <p className='text-xl'>Please sign in to request a new project</p>
      ) : (
        <div className='flex flex-col gap-y-3'>
          <p>
            Please enter your project details here. After submitting, the
            project will be checked by an admin and either accepted or rejected.
          </p>
          <ProjectRequestForm
            games={games}
            loading={status === 'loading'}
            onSubmit={(data) =>
              submitRequest({ projectRequestData: data }).then((r) => {
                const success = r.requestProject
                if (success) {
                  push('/request-project/success')
                }
                return success
              })
            }
          />
        </div>
      )}
    </div>
  )
}

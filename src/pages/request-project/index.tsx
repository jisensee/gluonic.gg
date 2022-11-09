import { Game } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select, Textarea } from 'react-daisyui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { z } from 'zod'
import { FormField } from '@/components/common/form'
import { prisma } from '@/server/db/client'
import { withOptionalUser } from '@/server/server-utils'
import { ProjectRouterInputs } from '@/utils/trpc-inputs'
import { trpc } from '@/utils/trpc'

type Props = {
  games?: Game[]
}

export const getServerSideProps: GetServerSideProps<Props> = (context) =>
  withOptionalUser(context, async (user) => {
    if (user.isNothing()) {
      return Promise.resolve({ props: {} })
    }

    const games = await prisma.game.findMany()
    return { props: { games } }
  })

type FormState = z.infer<typeof ProjectRouterInputs.request>

type ProjectRequestFormProps = {
  onSubmit: (data: FormState) => void
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
  } = useForm<FormState>({
    resolver: zodResolver(ProjectRouterInputs.request),
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  return (
    <form
      className='responsive-form flex flex-col gap-y-3'
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
        loading={loading}
      >
        Submit project
      </Button>
    </form>
  )
}

export default function RequestProjectPage({ games }: Props) {
  const { mutateAsync: submitRequest, status } =
    trpc.project.request.useMutation()
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
              submitRequest(data).then(() => {
                push('/request-project/success')
              })
            }
          />
        </div>
      )}
    </div>
  )
}

import { zodResolver } from '@hookform/resolvers/zod'
import { FC } from 'react'
import { Input, Textarea } from 'react-daisyui'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { errorColor, FormField, SaveButton } from './common/form'
import { Markdown } from './markdown'
import { postDataInput } from '@/utils/trpc-inputs'

type FormData = z.infer<typeof postDataInput>

export type PostFormProps = {
  initialData?: FormData
  onSubmit: (data: FormData) => void
  isLoading: boolean
  saveText: string
}

export const PostForm: FC<PostFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  saveText,
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(postDataInput),
    defaultValues: initialData,
    reValidateMode: 'onChange',
    mode: 'all',
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField label='Title' error={errors.title}>
        <Input {...register('title')} color={errorColor(errors.title)} />
      </FormField>
      <FormField
        label='Abstract'
        error={errors.abstract}
        infoMessage='This will be shown in bold before the actual post content.'
      >
        <Textarea
          {...register('abstract')}
          color={errorColor(errors.abstract)}
        />
      </FormField>
      <FormField label='Content' error={errors.body}>
        <Controller
          control={control}
          name='body'
          render={(p) => (
            <Markdown.Editor
              text={p.field.value ?? ''}
              onTextChange={p.field.onChange}
            />
          )}
        />
      </FormField>
      <SaveButton type='submit' disabled={!isValid || isLoading || !isDirty}>
        {saveText}
      </SaveButton>
    </form>
  )
}

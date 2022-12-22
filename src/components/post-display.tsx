'use client'

import { FC } from 'react'
import { Markdown } from './markdown'

export type PostDisplayProps = {
  title: string
  abstract: string
  body: string
}
export const PostDisplay: FC<PostDisplayProps> = ({
  title,
  abstract,
  body,
}) => (
  <div className='flex flex-col gap-y-3'>
    <h2>{title}</h2>
    <p className='font-bold'>{abstract}</p>
    <Markdown.Display>{body}</Markdown.Display>
  </div>
)

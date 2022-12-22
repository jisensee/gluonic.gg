'use client'

import { FC } from 'react'

type PostPreviewProps = {
  title: string
  abstract: string
  publishedAt: string
  shortAbstract?: boolean
}
export const PostPreview: FC<PostPreviewProps> = ({
  title,
  abstract,
  publishedAt,
  shortAbstract,
}) => (
  <div className='cursor-pointer rounded-xl bg-base-200 p-3 hover:bg-base-300'>
    <div className='flex flex-row items-center justify-between gap-x-3'>
      <h4>{title}</h4>
      <span className='italic opacity-80'>
        {new Date(publishedAt).toLocaleDateString()}
      </span>
    </div>
    <p className={shortAbstract ? 'line-clamp-1' : 'line-clamp-3'}>
      {abstract}
    </p>
  </div>
)

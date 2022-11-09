import { FC } from 'react'
import { Markdown } from './markdown'

type PostPreviewProps = {
  title: string
  abstract: string
  publishedAt: Date
  shortAbstract?: boolean
}
const PostPreview: FC<PostPreviewProps> = ({
  title,
  abstract,
  publishedAt,
  shortAbstract,
}) => (
  <div className='cursor-pointer rounded-xl bg-base-200 p-3 hover:bg-base-300'>
    <div className='flex flex-row items-center justify-between gap-x-3'>
      <h4>{title}</h4>
      <span className='italic opacity-80'>
        {publishedAt.toLocaleDateString()}
      </span>
    </div>
    <p className={shortAbstract ? 'line-clamp-1' : 'line-clamp-3'}>
      {abstract}
    </p>
  </div>
)

type PostDisplayProps = {
  title: string
  abstract: string
  body: string
}
const PostDisplay: FC<PostDisplayProps> = ({ title, abstract, body }) => (
  <div className='flex flex-col gap-y-3'>
    <h2>{title}</h2>
    <p className='font-bold'>{abstract}</p>
    <Markdown.Display>{body}</Markdown.Display>
  </div>
)
export const Post = {
  Preview: PostPreview,
  Display: PostDisplay,
}

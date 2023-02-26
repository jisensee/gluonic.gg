import { faNewspaper } from '@fortawesome/free-solid-svg-icons'
import { FC } from 'react'
import { LinkButton } from '@/components/common/link-button'
import { Link } from '@/components/link'
import { PostPreview } from '@/components/post-preview'

type SidebarProps = {
  posts: {
    id: string
    title: string
    abstract: string
    publishedAt: string
  }[]
  projectUrl: string
}

export const Sidebar: FC<SidebarProps> = ({
  posts,
  projectUrl,
}: SidebarProps) => (
  <div className='flex flex-col gap-y-3 md:w-1/3'>
    <h3>Other posts</h3>
    {posts.map((post) => (
      <Link key={post.id} href={`${projectUrl}/posts/${post.id}`}>
        <PostPreview
          title={post.title}
          abstract={post.abstract}
          publishedAt={post.publishedAt}
          shortAbstract
        />
      </Link>
    ))}
    <LinkButton
      href={`${projectUrl}/posts`}
      button={{ color: 'primary', fullWidth: true }}
      icon={faNewspaper}
    >
      All posts
    </LinkButton>
  </div>
)

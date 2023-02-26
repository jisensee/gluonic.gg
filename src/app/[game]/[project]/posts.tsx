import { faAdd, faNewspaper } from '@fortawesome/free-solid-svg-icons'
import { ProjectPost } from '@prisma/client'
import { FC } from 'react'
import { LinkButton } from '@/components/common/link-button'
import { Link } from '@/components/link'
import { PostPreview } from '@/components/post-preview'

type PostsProps = {
  posts: ProjectPost[]
  projectUrl: string
  canCreatePost: boolean
}

export const Posts: FC<PostsProps> = ({
  posts,
  projectUrl,
  canCreatePost,
}: PostsProps) => (
  <>
    <h2>Posts</h2>
    {posts.map((post) => (
      <Link href={`${projectUrl}/posts/${post.id}`} key={post.id}>
        <PostPreview
          title={post.title}
          abstract={post.abstract}
          publishedAt={post.publishedAt.toISOString()}
          shortAbstract
        />
      </Link>
    ))}
    {posts.length > 0 ? (
      <LinkButton
        button={{ color: 'primary', fullWidth: true }}
        icon={faNewspaper}
        href={`${projectUrl}/posts`}
      >
        All posts
      </LinkButton>
    ) : (
      <span>No posts yet</span>
    )}
    {canCreatePost && (
      <LinkButton
        href={`${projectUrl}/posts/new`}
        button={{ color: 'secondary', fullWidth: true }}
        icon={faAdd}
      >
        New post
      </LinkButton>
    )}
  </>
)

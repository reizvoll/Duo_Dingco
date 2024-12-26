import { fetchPostId } from '@/app/api/post/updating'
import UpdateForm from '@/components/posting/PostUpdateForm'
import { cache } from 'react'

export const dynamic = 'force-dynamic'

export default async function UpdatePage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params
  const post = await fetchPostId(id)

  if (!post) {
    return <div>Post not found.</div>
  }

  return <UpdateForm post={post} />
}

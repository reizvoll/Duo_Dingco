import { supabase } from '@/app/api/supabase'
import { fetchPostId } from '@/app/api/updating'
import UpdateForm from '@/components/posting/PostUpdateForm'

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

import { supabase } from '@/app/api/supabase'
import UpdateForm from '@/components/posting/PostUpdateForm'

export default async function UpdatePage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params

  // Fetch post data from Supabase
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !post) {
    return <div>Post not found.</div>
  }

  return <UpdateForm {...post} />
}

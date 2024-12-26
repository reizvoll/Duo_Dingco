import { supabase } from '@/supabase/supabaseClient'

export async function deletePostById(id: string) {
  const { error } = await supabase.from('posts').delete().eq('id', id)

  if (error) {
    console.error('Error deleting post:', error)
    throw new Error('Failed to delete post')
  }

  return true
}

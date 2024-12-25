import { supabase } from './supabase'

export async function updatePost({
  id,
  title,
  description,
  words,
}: {
  id: string
  title: string
  description: string
  words: any[]
}) {
  const { data, error } = await supabase
    .from('posts')
    .update({ title, description, words })
    .eq('id', id)
    .select()
  if (error) {
    console.error('Error updating post:', error)
    return null
  }
  return data
}

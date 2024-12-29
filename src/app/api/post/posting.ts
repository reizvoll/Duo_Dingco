import { supabase } from '@/supabase/supabaseClient'

export async function fetchUser(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) {
    throw new Error('Error Fetching user')
  }
  return data
}

// Insert a new post
export async function insertPost({
  title,
  description,
  words,
  userId,
}: {
  title: string
  description: string
  words: Array<{ word: string; meaning: string }>
  userId: string
}) {
  const { data, error } = await supabase
    .from('posts')
    .insert([
      {
        title,
        description,
        words,
        user_id: userId,
      },
    ])
    .select()
  if (error) {
    console.error('Error inserting post:', error)
    throw new Error('Failed to insert post. Please try again.')
  }
  return data
}

import { supabase } from '@/supabase/supabaseClient'

export async function fetchUser(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) {
    console.error('Error fetching user:', error)
    return null
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
  words: any[]
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
    return null
  }
  return data
}

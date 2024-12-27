import { supabase } from '@/supabase/supabaseClient'
import { User } from '@/types/user'

export const fetchUserById = async (userId: string) => {
  const { data, error } = await supabase
    .from('Users')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw new Error(error.message)
  return data
}

export const fetchProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, nickname, img_url')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching author:', error.message)
    return null
  }
  return data as User
}

export const addCommentToPost = async (
  postId: string,
  userId: string,
  content: string,
) => {
  const { data, error } = await supabase
    .from('Comments')
    .insert({ postId, userId, content })
  if (error) throw new Error(error.message)
  return data
}

export const deleteCommentById = async (commentId: string) => {
  await supabase.from('Comments').delete().eq('id', commentId)
}

export const updateCommentById = async (
  postId: string,
  userId: string,
  content: string,
) => {
  const { data, error } = await supabase
    .from('comments')
    .upsert({ postId, userId, content })
    .select()

  if (error) throw new Error(error.message)
  return data
}

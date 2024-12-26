import { supabase } from '@/supabase/supabaseClient'
import { User } from '@/types/user'

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

export async function fetchBookmarkStatus(postId: string, userId: string) {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    // Ignore no rows found error
    console.error('Error fetching bookmark status:', error.message)
    return null
  }

  return data
}

export async function toggleBookmark(
  postId: string,
  userId: string,
  isBookmarked: boolean,
) {
  if (isBookmarked) {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error removing bookmark:', error.message)
    }
  } else {
    const { error } = await supabase
      .from('bookmarks')
      .insert({ post_id: postId, user_id: userId })

    if (error) {
      console.error('Error adding bookmark:', error.message)
    }
  }
}

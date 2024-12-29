import { supabase } from '@/supabase/supabaseClient'

export async function fetchBookmarkStatus(postId: string, userId: string) {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    return null
  }

  return data ? true : false
}

export async function toggleBookmark(
  postId: string,
  userId: string,
  isBookmarked: boolean,
): Promise<boolean> {
  if (isBookmarked) {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error removing bookmark:', error.message)
      return false
    }
  } else {
    const { error } = await supabase
      .from('bookmarks')
      .insert({ post_id: postId, user_id: userId })

    if (error) {
      console.error('Error adding bookmark:', error.message)
      return false
    }
  }
  return true
}
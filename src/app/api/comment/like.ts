import { supabase } from '@/supabase/supabaseClient'

export const toggleLikeStatus = async (
  postId: string,
  userId: string,
  hasLiked: boolean,
) => {
  if (hasLiked) {
    await supabase
      .from('Likes')
      .delete()
      .eq('postId', postId)
      .eq('userId', userId)
  } else {
    await supabase.from('Likes').insert({ postId, userId })
  }
}

export const fetchLikesCountByPostId = async (postId: string) => {
  const { count } = await supabase
    .from('Likes')
    .select('*', { count: 'exact' })
    .eq('postId', postId)
  return count || 0
}

import { supabase } from '@/supabase/supabaseClient'

export async function fetchPostList() {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, words, user_id, users(nickname, img_url)')

  if (error) {
    console.error('Error fetching posts with author details:', error.message)
    return []
  }

  return data.map((post) => ({
    id: post.id,
    title: post.title,
    wordCount: Array.isArray(post.words) ? post.words.length : 0,
    author: {
      nickname: post.users?.nickname || 'Unknown',
      imgUrl: post.users?.img_url || '',
    },
  }))
}

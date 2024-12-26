export interface Post {
  id: string
  title: string
  description: string
  created_at: string
  user_id: string
  words: { word: string; meaning: string }[]
}

export interface BookmarkStatus {
  postId: string
  userId: string
  isBookmarked: boolean
}

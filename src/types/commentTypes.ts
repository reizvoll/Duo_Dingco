export interface Post {
  id: string
  title: string
  description?: string
  created_at: string
  user_id: string
  words: { word: string; meaning: string }[]
}

export interface BookmarkStatus {
  postId: string
  userId: string
  isBookmarked: boolean
}

// 추가로 북마크 기능하는 타입 우선.. 급하게 추가.
// 나중에 extends 사용해서 수정할 것! ((중요중요))
export interface Bookmarks {
  id: string
  title: string
  description: string
  words: { word: string; meaning: string }[]
  user_id: string
  users?: {
    img_url: string | null 
    nickname: string
  }
  isBookmarked?: boolean
}
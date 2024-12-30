export type User = {
    nickname: string
    img_url: string | null
  }
  
  export type Post = {
    id: string
    title: string
    user_id: string
    words: string[]
    users: User
    isBookmarked: boolean
  }
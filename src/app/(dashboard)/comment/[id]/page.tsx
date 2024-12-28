'use client'

import { useParams } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import CardInfo from '@/components/comment/CardInfo'

export default function CommentPage() {
  const user = useAuthStore((state) => state.user)
  const params = useParams()
  const postId = params?.id as string

  if (!user || !user.id) {
    console.log(Error)
    return null
  }
  const userId = user.id

  if (!postId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-center">
          잘못된 접근입니다. 게시글 ID가 없습니다.
        </h1>
      </div>
    )
  }

  return (
    <div className="px-4 py-8 max-w-[1200px] mx-auto bg-transparent">
      <CardInfo postId={postId} userId={userId} />
    </div>
  )
}

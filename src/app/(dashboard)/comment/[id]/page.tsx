'use client'

import { useParams, useRouter } from 'next/navigation'

import CardInfo from '@/components/comment/CardInfo'
import { useAuthStore } from '@/store/auth'
import { useEffect } from 'react'

export default function CommentPage() {
  const params = useParams()
  const router = useRouter()
  const postId = params?.id as string

  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    }
  }, [user, router])

  if (!user) {
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
    <div className="px-4 py-8 max-w-[1200px] mx-auto">
      <CardInfo postId={postId} userId={userId} />
    </div>
  )
}

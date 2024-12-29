'use client'

import { useParams } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import CardInfo from '@/components/comment/CardInfo'
import CardSlide from '@/components/comment/CardSlide'
import { useEffect, useState } from 'react'

export default function CommentPage() {
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const user = useAuthStore((state) => state.user)
  const params = useParams()
  const postId = params?.id as string

  useEffect(() => {
    if (user) {
      setIsLoadingUser(false) // 사용자 정보가 로드되면 로딩 상태 종료
    }
  }, [user])

  // 사용자 정보 또는 postId가 없을 때 처리
  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-center">Loading user data...</h1>
      </div>
    )
  }

  // 전역 에러 처리로 위임
  if (!user || !user.id) {
    throw new Error('User or user ID is missing')
  }

  if (!postId) {
    throw new Error('Post ID is missing')
  }

  return (
    <div className="px-4 py-8 max-w-[1200px] mx-auto bg-transparent">
      <CardInfo postId={postId} userId={user.id} />
      <CardSlide />
    </div>
  )
}

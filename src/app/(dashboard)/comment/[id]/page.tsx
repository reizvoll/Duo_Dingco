'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import CardInfo from '@/components/comment/CardInfo'
import CardSlide from '@/components/comment/CardSlide'

import { useAuthStore } from '@/store/auth'

export default function CommentPage() {
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const user = useAuthStore((state) => state.user)
  const params = useParams()
  const postId = params?.id as string

  useEffect(() => {
    if (user) {
      setIsLoadingUser(false)
    }
  }, [user])

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-center">Loading user data...</h1>
      </div>
    )
  }

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

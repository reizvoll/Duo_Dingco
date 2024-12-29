'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/supabase/supabaseClient'
import { useAuthStore } from '@/store/auth'
import { FaCircleArrowLeft, FaCircleArrowRight } from 'react-icons/fa6'
import { useState } from 'react'
import BookmarkedCard from './BookmarkedCard'
import { useRouter } from 'next/navigation'
import { Post } from '@/types/mypageTypes'

// 북마크된 게시물 데이터 조회
const fetchUserBookmarks = async (userId: string): Promise<Post[]> => {
  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('post_id')
    .eq('user_id', userId)

  const postIds = bookmarks?.map((bookmark) => bookmark.post_id) || []

  const { data: posts } = await supabase
    .from('posts')
    .select(
      `
      id,
      title,
      user_id,
      words,
      users(*)
    `,
    )
    .in('id', postIds)

  // 게시물 데이터 파싱 및 기본값 설정
  return Array.isArray(posts)
    ? posts.map((post) => ({
        ...post,
        words:
          typeof post.words === 'string'
            ? JSON.parse(post.words)
            : post.words || [],
        isBookmarked: true,
        users: {
          ...post.users,
          img_url: post.users.img_url || '/dingco.png',
        },
      }))
    : []
}

export default function BookmarkCardList() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [currentIndex, setCurrentIndex] = useState(0)
  const router = useRouter()
  const maxVisibleCards = 4

  // 북마크 데이터 조회
  const {
    data: bookmarkedPosts = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ['bookmarkedPosts', user?.id],
    queryFn: () => fetchUserBookmarks(user?.id!),
    enabled: !!user?.id,
  })

  // 북마크 토글
  const toggleBookmark = async (id: string) => {
    if (!user) return router.push('/auth/signin')

    const post = bookmarkedPosts.find((p) => p.id === id)
    if (!post) return

    const isBookmarked = post.isBookmarked

    try {
      isBookmarked
        ? await supabase
            .from('bookmarks')
            .delete()
            .eq('user_id', user.id)
            .eq('post_id', id)
        : await supabase
            .from('bookmarks')
            .insert({ user_id: user.id, post_id: id })

      // 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: ['bookmarkedPosts', user?.id] })
    } catch (error) {
      console.error('Error toggling bookmark:', error)
    }
  }

  const handleGoToDetails = (id: string) => router.push(`/comment/${id}`)

  // 로딩 및 에러 상태
  if (isPending) return <div>Loading...</div>
  if (isError || bookmarkedPosts.length === 0)
    return <div className="text-white">북마크한 게시물이 없습니다.</div>

  return (
    <div className="flex flex-col items-center mt-12">
      <h1 className="text-3xl font-bold text-white mb-8">즐겨찾기한 카드</h1>

      {/* 카드 슬라이드 */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
          className={`p-2 ${currentIndex === 0 ? 'text-gray-500' : 'text-white'}`}
        >
          <FaCircleArrowLeft size={36} />
        </button>

        {/* 카드 목록 */}
        <div className="flex gap-6 overflow-hidden">
          {bookmarkedPosts
            .slice(currentIndex, currentIndex + maxVisibleCards)
            .map((post) => (
              <BookmarkedCard
                key={post.id}
                post={post}
                onToggleBookmark={toggleBookmark}
                handleGoToDetails={handleGoToDetails}
              />
            ))}
        </div>

        <button
          onClick={() =>
            currentIndex < bookmarkedPosts.length - maxVisibleCards &&
            setCurrentIndex(currentIndex + 1)
          }
          disabled={currentIndex >= bookmarkedPosts.length - maxVisibleCards}
          className={`p-2 ${currentIndex >= bookmarkedPosts.length - maxVisibleCards ? 'text-gray-500' : 'text-white'}`}
        >
          <FaCircleArrowRight size={36} />
        </button>
      </div>
    </div>
  )
}
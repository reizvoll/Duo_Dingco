'use client'

import { fetchBookmarkStatus, toggleBookmark } from '@/app/api/comment/bookmark'
import { fetchProfile } from '@/app/api/comment/fetchDataInfo'
import { fetchPostId } from '@/app/api/post/updating'
import { CardInfoProps } from '@/types/CardInfoProps'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { RiStarFill, RiStarLine } from 'react-icons/ri'

export default function CardInfo({ postId, userId }: CardInfoProps) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const {
    data: post,
    isPending: isPostPending,
    isError: isPostError,
  } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPostId(postId),
    enabled: !!postId,
  })

  const {
    data: profile,
    isPending: isProfilePending,
    isError: isProfileError,
  } = useQuery({
    queryKey: ['profile', post?.user_id],
    queryFn: () => fetchProfile(post?.user_id!),
    enabled: !!post?.user_id,
  })

  const {
    data: isBookmarked,
    isPending: isBookmarkedPending,
    isError: isBookmarkedError,
  } = useQuery({
    queryKey: ['bookmark', postId, userId],
    queryFn: () => fetchBookmarkStatus(postId, userId),
    enabled: !!postId && !!userId,
    select: (data) => !!data,
  })

  const handleBookmarkToggle = async () => {
    if (isBookmarked) {
      await toggleBookmark(postId, userId, true)
    } else {
      await toggleBookmark(postId, userId, false)
    }
    queryClient.invalidateQueries({ queryKey: ['bookmark', postId, userId] })
  }

  if (isPostPending || isProfilePending || isBookmarkedPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-3xl font-bold text-center">Loading...</p>
      </div>
    )
  }

  if (isPostError || isProfileError || isBookmarkedError || !post || !profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-3xl font-bold text-center">
          Error loading card information.
        </p>
      </div>
    )
  }

  return (
    // 카드 정보 세션
    <div className="m-16 text-white p-6 rounded-lg mb-8">
      <h1 className="text-3xl font-bold mb-12">카드 정보</h1>
      <div className="flex justify-between items-center mb-6">
        {/* 왼쪽 부분 세션 */}
        <div className="w-[400px] h-[300px] flex flex-col">
          {/* 제목과 내용 북마크 */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{post.title}</h2>
            <button onClick={handleBookmarkToggle} className="text-yellow-400">
              {isBookmarked ? (
                <RiStarFill size={24} />
              ) : (
                <RiStarLine size={24} />
              )}
            </button>
          </div>
          <p className="text-white text-lg mt-2 mb-4">{post.description}</p>
          <div className="flex items-center gap-2">
            <img
              src={profile?.img_url}
              alt={profile?.nickname}
              className="w-10 h-10 rounded-full"
            />
            <span>{profile?.nickname}</span>
          </div>
          <div className="self-end mt-auto text-gray-500 text-right font-medium">
            등록일: {new Date(post.created_at).toLocaleDateString()}
          </div>
        </div>

        {/* 오른쪽 부분 세션 */}
        <div className="w-[400px] h-[300px] flex items-center flex-col justify-center bg-gray-900 rounded-lg">
          <div className="w-72 h-40 bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="bg-[#0A092D] text-white text-lg tracking-wide font-bold py-2 px-6 rounded-lg">
              {typeof post.words === 'string' || Array.isArray(post.words)
                ? post.words.length
                : 0}
              단어
            </div>
          </div>
          <button
            type="button"
            className="w-[100px] p-2 font-bold rounded-xl border-2 mt-6 text-white"
            onClick={() => router.push(`/learning/${postId}`)}
          >
            학습하기
          </button>
        </div>
      </div>
    </div>
  )
}
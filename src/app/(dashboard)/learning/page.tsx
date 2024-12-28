'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/supabase/supabaseClient'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FaStar } from 'react-icons/fa6'
import { FaRegStar } from 'react-icons/fa6'
import { Bookmarks } from '@/types/commentTypes'
import { useAuthStore } from '@/store/auth' // Zustand 스토어 사용

export default function LearnListPage() {
  const { user, clearUser } = useAuthStore() // Zustand 스토어에서 유저 정보 가져오기
  const [posts, setPosts] = useState<Bookmarks[]>([])
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // 유저 세션 확인 및 로그인 유지
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error || !data.session) {
        clearUser()
        router.push('/auth/signin')
        return
      }
    }
    checkSession()
  }, [router, clearUser])

  // posts 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setError('로그인이 필요합니다.')
        return
      }

      try {
        const { data: postData, error: postError } = await supabase.from(
          'posts',
        ).select(`
          id,
          title,
          description,
          words,
          user_id,
          users(*),
          bookmarks(post_id, user_id)
        `)

        if (postError) {
          setError('posts 데이터를 가져오는 중 오류가 발생했습니다.')
          return
        }

        const parsedPosts = postData.map((post) => ({
          ...post,
          words:
            typeof post.words === 'string'
              ? JSON.parse(post.words)
              : post.words,
          isBookmarked: post.bookmarks.some(
            (bookmark) => bookmark.user_id === user.id,
          ),
        }))

        setPosts(parsedPosts)
      } catch (err) {
        setError('데이터를 가져오는 중 오류 발생')
      }
    }

    fetchData()
  }, [user]) // user가 있을 때만 실행

  // 북마크 토글
  const toggleBookmark = async (id: string) => {
    if (!user) {
      router.push('/auth/signin')
      return
    }

    const post = posts.find((p) => p.id === id)
    if (!post) return

    const isBookmarked = post.isBookmarked

    try {
      if (isBookmarked) {
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', id)
      } else {
        await supabase.from('bookmarks').insert({
          user_id: user.id,
          post_id: id,
        })
      }

      setPosts((prev) =>
        prev.map((post) =>
          post.id === id ? { ...post, isBookmarked: !post.isBookmarked } : post,
        ),
      )
    } catch (err) {
      setError('북마크 처리 중 오류 발생')
    }
  }

  const handleGoToDetails = (id: string) => {
    router.push(`/learning/${id}`)
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A092D] text-white overflow-y-auto">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A092D] text-white flex">
      {/* 메인 콘텐츠 */}
      <div className="flex-1 ml-20 p-8 overflow-y-auto h-screen">
        <div className="relative flex flex-col items-center justify-center">
          {/* 학습 페이지 제목 */}
          <div className="absolute top-14 left-40">
            <h1 className="text-3xl font-bold">학습하기</h1>
          </div>

          {/* 카드 묶음 */}
          <div className="flex items-center justify-center w-full mt-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="w-56 h-56 bg-[#2E3856] text-white rounded-lg shadow-lg"
                >
                  <div className="w-full h-full flex flex-col p-3">
                    <h2 className="text-lg font-semibold truncate mb-4">
                      {post.title}
                    </h2>

                    <div className="text-sm text-gray-300 flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <Image
                          src={post.users?.img_url || '/dingco.png'}
                          alt="Profile"
                          width={30}
                          height={30}
                          className="rounded-full"
                        />
                        <p>{post.users?.nickname || 'Unknown User'}</p>
                      </div>
                      <button
                        className="ml-4"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleBookmark(post.id)
                        }}
                      >
                        {post.isBookmarked ? (
                          <FaStar className="w-[30px] h-[30px]" />
                        ) : (
                          <FaRegStar className="w-[30px] h-[30px]" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-center mt-6">
                      <div
                        className="text-lg rounded-lg bg-[#282E3E] text-center text-white flex items-center justify-center
                          cursor-pointer hover:bg-[#3f475e] transition duration-300 
                          h-14 w-28 sm:h-16 sm:w-32 md:h-18 md:w-36 lg:h-18 lg:w-36"
                        onClick={() => handleGoToDetails(post.id)}
                      >
                        {post.words.length} 단어
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

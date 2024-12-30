'use client'

import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { FaStar } from 'react-icons/fa6'
import { FaRegStar } from 'react-icons/fa6'

import { supabase } from '@/supabase/supabaseClient'

import { Bookmarks } from '@/types/commentTypes'
import { UserData } from '@/types/user'

import { useAuthStore } from '@/store/auth'

export default function HotLearningPage() {
  const { user, setUser, clearUser } = useAuthStore() // Zustand 스토어에서 상태 사용
  const [posts, setPosts] = useState<Bookmarks[]>([]) // 게시글 상태
  const [users, setUsers] = useState<UserData[]>([]) // 사용자 정보 상태
  const [error, setError] = useState<string | null>(null) // 에러 메시지 상태
  const router = useRouter() // 페이지 이동을 위한 라우터

  // 세션 확인 및 로그인 상태 유지
  useEffect(() => {
    const checkSession = async () => {
      // Supabase에서 현재 로그인 세션 확인
      const { data, error } = await supabase.auth.getSession()
      if (error || !data.session) {
        clearUser() // 로그인 세션이 없으면 유저 정보 초기화
        router.push('/auth/login') // 로그인 페이지로 이동
        return
      }

      // 로그인 세션이 있으면 Zustand 스토어에 사용자 정보 저장
      const supabaseUser = data.session.user
      if (supabaseUser) {
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          nickname: supabaseUser.user_metadata?.nickname, //에러떠서 추가해줌
          img_url: supabaseUser.user_metadata?.img_url || '', // 프로필 이미지
        })
      }
    }
    checkSession()
  }, [router, setUser, clearUser])

  // 게시글, 사용자 정보, 북마크 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 게시글 데이터 가져오기
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('id, title, description, words, user_id')
          .order('created_at', { ascending: false })

        if (postError) {
          setError('posts 데이터를 가져오는 중 오류가 발생했습니다.')
          return
        }

        // 사용자 데이터 가져오기
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, nickname, img_url, created_at')

        if (userError) {
          setError('users 데이터를 가져오는 중 오류가 발생했습니다.')
          return
        }

        // 북마크 데이터 가져오기 (현재 유저의 북마크만 가져오기)
        const { data: bookmarkData, error: bookmarkError } = await supabase
          .from('bookmarks')
          .select('post_id')
          .eq('user_id', user?.id || '')

        if (bookmarkError) {
          setError('북마크 데이터를 가져오는 중 오류가 발생했습니다.')
          return
        }

        // 북마크된 게시글 ID 추출
        const bookmarkedPostIds = bookmarkData?.map(
          (bookmark) => bookmark.post_id,
        )

        // 게시글 데이터에 북마크 정보 추가
        const parsedPosts = postData.map((post) => ({
          ...post,
          words:
            typeof post.words === 'string'
              ? JSON.parse(post.words)
              : post.words, // words를 JSON 형식으로 변환
          isBookmarked: bookmarkedPostIds?.includes(post.id) || false, // 북마크 상태 추가
        }))

        setPosts(parsedPosts) // 게시글 상태 업데이트
        setUsers(userData as UserData[]) // 사용자 정보 상태 업데이트
        setError(null)
      } catch (error) {
        setError('데이터를 가져오는 중 오류가 발생했습니다.')
      }
    }

    if (user) {
      fetchData()
    }
  }, [user]) // user가 변경될 때마다 실행

  // 북마크 토글 함수 (클릭하면 북마크 추가/삭제)
  const toggleBookmark = async (id: string) => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    try {
      const post = posts.find((p) => p.id === id)
      if (!post) return

      const isBookmarked = post.isBookmarked

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

      // Supabase와 동기화된 데이터 가져오기
      const { data: bookmarkData } = await supabase
        .from('bookmarks')
        .select('post_id')
        .eq('user_id', user.id)

      const bookmarkedPostIds = bookmarkData?.map(
        (bookmark) => bookmark.post_id,
      )

      setPosts((prev) =>
        prev.map((post) => ({
          ...post,
          isBookmarked: bookmarkedPostIds?.includes(post.id) || false,
        })),
      )
    } catch (error) {
      setError('북마크 상태를 변경할 수 없습니다.')
    }
  }

  // 상세정보 페이지로 이동하는 함수
  const handleGoToDetails = (id: string) => {
    router.push(`/comment/${id}`)
  }

  // 사용자 ID로 닉네임과 이미지 가져오기
  const getUserInfo = (userId: string) => {
    const user = users.find((user) => user.id === userId)
    return user ? { nickname: user.nickname, img_url: user.img_url } : {}
  }

  // 에러가 있으면 에러 메시지 표시
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A092D] text-white overflow-y-auto">
        <p>{error}</p>
      </div>
    )
  }

  // 메인 UI 렌더링
  return (
    <div className="min-h-screen bg-[#0A092D] text-white flex justify-center">
      <div className="max-w-custom w-full flex flex-col p-8 h-screen">
        <div className="flex items-center justify-center w-full mt-[60px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {/* 🔥오늘 작성된 따끈~한 단어 제목 */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex justify-start">
              <h1 className="text-3xl font-bold mb-[10px] pl-[10px]">
                🔥오늘 작성된 따끈~한 단어
              </h1>
            </div>

            {posts.map((post) => {
              const userInfo = getUserInfo(post.user_id)

              return (
                <div
                  key={post.id}
                  className="w-56 h-56 bg-[#2E3856] text-white rounded-lg shadow-lg"
                >
                  <div className="w-full h-full flex flex-col p-6">
                    <h2 className="text-lg font-semibold truncate mb-2">
                      {post.title}
                    </h2>

                    {/* 작성자 정보와 북마크 */}
                    <div className="text-sm flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Image
                          src={userInfo.img_url || '/dingco.png'}
                          alt="Profile"
                          width={35}
                          height={35}
                          className="rounded-full border"
                        />
                        <p>{userInfo.nickname || 'Unknown User'}</p>
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

                    {/* 단어 개수 버튼 */}
                    <div className="flex items-center justify-center mt-6">
                      <div
                        className="text-lg rounded-lg bg-[#282E3E] text-center text-white flex items-center justify-center
                          cursor-pointer hover:bg-[#3f475e] transition duration-300
                          h-14 w-28 sm:h-16 sm:w-32"
                        onClick={() => handleGoToDetails(post.id)}
                      >
                        {post.words.length} 단어
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

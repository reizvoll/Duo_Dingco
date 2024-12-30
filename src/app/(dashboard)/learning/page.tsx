'use client'

import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { FaStar } from 'react-icons/fa6'
import { FaRegStar } from 'react-icons/fa6'

import { useAuthStore } from '@/store/auth'

import { Bookmarks } from '@/types/commentTypes'

import { supabase } from '@/supabase/supabaseClient'

export default function LearnListPage() {
  //clearUser는 Zustand 스토어에서 유저 정보를 초기화(세션이 만료되거나 유효하지 않을 때)
  const { user, setUser, clearUser } = useAuthStore()
  const [posts, setPosts] = useState<Bookmarks[]>([]) // 게시글 목록을 상태로 저장
  const [error, setError] = useState<string | null>(null) // 에러 메시지 상태
  const [isPending, setIsPending] = useState(true) // 로딩 상태
  const router = useRouter()

  // 1.유저 세션 확인 및 로그인 유지
  useEffect(() => {
    const checkSession = async () => {
      // 이미 user가 존재하면 세션 확인 건너뛰기
      if (user) {
        setIsPending(false)
        return
      }

      const { data, error } = await supabase.auth.getSession()
      if (error || !data.session) {
        clearUser() // 유효하지 않은 세션일 경우 유저 정보 초기화
        router.push('/auth/login') // 로그인 페이지로 리다이렉트
        return
      }

      // 세션이 유효하면 Zustand에 사용자 정보 설정 (동일하게 만들어줌..)
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

  // 2. posts 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return // 유저가 없으면 데이터를 가져오지 않음

      //외래 키 관계를 통해 bookmarks 테이블에서 현재 post와 관련된 데이터를 함께 불러옴
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
        `) // posts 데이터를 가져옴

        if (postError) {
          setError('posts 데이터를 가져오는 중 오류가 발생했습니다.')
          setIsPending(false) // 로딩 종료
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
          ), // 현재 사용자의 북마크 여부 판단
        }))

        setPosts(parsedPosts) // 상태에 posts 설정
        setError(null) // 오류 상태 초기화
        setIsPending(false) // 로딩 종료
      } catch (err) {
        setError('데이터를 가져오는 중 오류 발생') // 예외 처리
        setIsPending(false) // 로딩 종료
      }
    }

    fetchData()
  }, [user]) // user가 있을 때만 실행

  // 3. 북마크 토글
  const toggleBookmark = async (id: string) => {
    if (!user) {
      router.push('/auth/login') // 유저가 없으면 로그인 페이지로 이동
      return
    }
    // 현재 게시글 정보 가져오기

    const post = posts.find((p) => p.id === id)
    if (!post) return

    //북마크를 추가하거나 삭제하여, 현재 사용자가 특정 게시글을 북마크 상태로 유지
    const isBookmarked = post.isBookmarked // 북마크 여부 확인
    try {
      if (isBookmarked) {
        // 북마크 삭제 요청
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', id)
      } else {
        // 북마크 추가 요청
        await supabase.from('bookmarks').insert({
          user_id: user.id,
          post_id: id,
        })
      }
      // 상태 업데이트
      // 이전 상태의 posts를 순회하며, 해당 post의 id가 클릭한 post의 id와 같다면
      setPosts((prev) =>
        prev.map((post) =>
          // isBookmarked 상태를 반전시켜 업데이트하고, 나머지는 그대로 유지
          post.id === id ? { ...post, isBookmarked: !post.isBookmarked } : post,
        ),
      )
    } catch (err) {
      setError('북마크 처리 중 오류 발생') // 예외 처리
    }
  }
  //4. 동적세그먼트로 이동
  const handleGoToDetails = (id: string) => {
    router.push(`/learning/${id}`) // 상세 페이지로 이동
  }

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A092D] text-white">
        <p>로딩 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A092D] text-white overflow-y-auto">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex justify-center">
      <div className="max-w-custom w-full flex flex-col p-8 h-screen">
        <div className="flex items-center justify-center w-full mt-[60px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {/* 학습하기 제목 */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex justify-start">
              <h1 className="text-3xl font-bold mb-[10px]">학습하기</h1>
            </div>

            {posts.map((post) => (
              <div
                key={post.id}
                className="w-56 h-56 bg-[#2E3856] text-white rounded-lg shadow-lg"
              >
                <div className="w-full h-full flex flex-col p-6">
                  <h2 className="text-lg font-semibold truncate mb-2">
                    {post.title}
                  </h2>

                  <div className="text-sm flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Image
                        src={post.users?.img_url || '/dingco.png'}
                        alt="Profile"
                        width={35}
                        height={35}
                        className="rounded-full border"
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
                        h-14 w-28 sm:h-16 sm:w-32"
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
  )
}

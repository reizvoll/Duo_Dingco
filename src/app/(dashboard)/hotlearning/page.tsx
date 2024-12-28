'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/supabase/supabaseClient'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FaStar } from 'react-icons/fa6'
import { FaRegStar } from 'react-icons/fa6'
import { Bookmarks } from '@/types/commentTypes'
import { UserData } from '@/types/user'
import { handleError } from './errorHandler'

export default function HotLearningPage() {
  const [posts, setPosts] = useState<Bookmarks[]>([])
  const [users, setUsers] = useState<UserData[]>([])
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // 로그인 안했어? 바로 게라웃
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error || !data.session) {
        router.push('/auth/signin')
      }
    }
    checkSession()
  }, [router])

  useEffect(() => {
    const fetchData = async () => {
      //에러핸들러 hotlearn 폴더에 넣어둔 거 가져와서 뿌림
      try {
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('id, title, description, words, user_id')
          .order('created_at', { ascending: false })

        if (postError)
          setError('posts 데이터를 가져오는 중 오류가 발생했습니다.')

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, nickname, img_url, created_at')

        if (userError)
          setError('users 데이터를 가져오는 중 오류가 발생했습니다.')

        const { data: bookmarkData, error: bookmarkError } = await supabase
          .from('bookmarks')
          .select('post_id')

        if (bookmarkError)
          setError('bookmarks 데이터를 가져오는 중 오류가 발생했습니다.')

        const bookmarkedPostIds = bookmarkData?.map(
          (bookmark) => bookmark.post_id,
        )

        const parsedPosts = (postData as Bookmarks[]).map((post) => ({
          ...post,
          words:
            typeof post.words === 'string'
              ? JSON.parse(post.words)
              : post.words,
          isBookmarked: bookmarkedPostIds?.includes(post.id) || false,
        }))

        setPosts(parsedPosts)
        setUsers(userData as UserData[])
      } catch (error) {
        setError(handleError(error)) // 에러 핸들러 호출
      }
    }

    fetchData()
  }, [])

  const toggleBookmark = async (id: string) => {
    const user = await supabase.auth.getUser()
    if (!user.data.user) {
      router.push('/auth/signin') // 로그인 페이지로 리다이렉트
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
          .eq('user_id', user.data.user.id)
          .eq('post_id', id)
      } else {
        await supabase.from('bookmarks').insert({
          user_id: user.data.user.id,
          post_id: id,
        })
      }

      setPosts((prev) =>
        prev.map((post) =>
          post.id === id ? { ...post, isBookmarked: !post.isBookmarked } : post,
        ),
      )
    } catch (error) {
      setError(handleError(error)) // 에러 핸들러 호출
    }
  }
  // 상세정보페이지로 이동하는 함수~!~!~!
  const handleGoToDetails = (id: string) => {
    router.push(`/comment/${id}`)
  }

  const getUserInfo = (userId: string) => {
    const user = users.find((user) => user.id === userId)
    return user ? { nickname: user.nickname, img_url: user.img_url } : {}
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
      <div className="flex-1 ml-20 p-8 overflow-y-auto h-screen">
        <div className="relative flex flex-col items-center justify-center">
          <div className="absolute top-14 left-40">
            <h1 className="text-3xl font-bold pl-[390px]">
              🔥오늘 작성된 따끈~한 단어
            </h1>
          </div>

          {/* 카드 묶음 */}
          <div className="flex items-center justify-center w-full mt-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {posts.map((post) => {
                const userInfo = getUserInfo(post.user_id)

                return (
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
                            src={userInfo.img_url || '/dingco.png'}
                            alt="Profile"
                            width={30}
                            height={30}
                            className="rounded-full"
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
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

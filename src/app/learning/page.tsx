'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../api/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Word = {
  id: string // 단어 ID
  words: string // 단어
  meaning: string // 단어의 뜻
}

type Post = {
  id: string // 학습 리스트 ID
  title: string // 학습 리스트 제목
  description: string // 학습 리스트 설명
  words: Word[] // 단어 목록
  user_id: string // 작성자 ID
  isBookmarked?: boolean // 북마크 상태
}

type User = {
  id: string // 유저 ID
  nickname: string // 유저 닉네임
  img_url: string // 유저 프로필 이미지 URL
  created_at: string // 유저 생성 날짜
}

export default function LearnListPage() {
  const [posts, setPosts] = useState<Post[]>([]) // Supabase에서 가져온 posts 데이터
  const [users, setUsers] = useState<User[]>([]) // Supabase에서 가져온 users 데이터
  const [error, setError] = useState<string | null>(null) // 에러 상태
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error || !data.session) {
        router.push('/auth/sigin') // 세션이 없으면 로그인 페이지로 이동
      }
      console.log('data', data)
    }
    checkSession()
  }, [router])

  useEffect(() => {
    const fetchData = async () => {
      // posts 데이터 가져오기
      const { data: postData, error: postError } = await supabase.from('posts')
        .select(`
          id,
          title,
          description,
          words,
          user_id
        `)

      if (postError) {
        setError('posts 데이터를 가져오는 중 오류가 발생했습니다.')
        console.error('Supabase posts fetch error:', postError.message)
        return
      }

      // users 데이터 가져오기
      const { data: userData, error: userError } = await supabase.from('users')
        .select(`
          id,
          nickname,
          img_url,
          created_at
        `)

      if (userError) {
        setError('users 데이터를 가져오는 중 오류가 발생했습니다.')
        console.error('Supabase users fetch error:', userError.message)
        return
      }

      // 🔥 추가: bookmarks 데이터 가져오기
      const { data: bookmarkData, error: bookmarkError } = await supabase
        .from('bookmarks')
        .select('post_id')

      if (bookmarkError) {
        console.error('Supabase bookmarks fetch error:', bookmarkError.message)
        return
      }

      const bookmarkedPostIds = bookmarkData?.map(
        (bookmark) => bookmark.post_id,
      )

      // posts 데이터에 isBookmarked 값 업데이트
      const parsedPosts = (postData as Post[]).map((post) => ({
        ...post,
        words:
          typeof post.words === 'string' ? JSON.parse(post.words) : post.words,
        isBookmarked: bookmarkedPostIds?.includes(post.id) || false,
      }))

      setPosts(parsedPosts)
      setUsers(userData as User[])
    }

    fetchData()
  }, [])

  const toggleBookmark = async (id: string) => {
    const user = await supabase.auth.getUser()
    if (!user.data.user) {
      router.push('/auth/signin') // 유저가 없으면 로그인 페이지로 이동
      return
    }

    const post = posts.find((p) => p.id === id)
    if (!post) return

    const isBookmarked = post.isBookmarked

    if (isBookmarked) {
      // 북마크 해제
      await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.data.user.id)
        .eq('post_id', id)
    } else {
      // 북마크 추가
      await supabase.from('bookmarks').insert({
        user_id: user.data.user.id,
        post_id: id,
      })
    }

    // 로컬 상태 업데이트
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, isBookmarked: !post.isBookmarked } : post,
      ),
    )
  }

  const handleGoToDetails = (id: string) => {
    router.push(`/learning/${id}`)
  }

  const getUserInfo = (userId: string) => {
    const user = users.find((user) => user.id === userId)
    return user ? { nickname: user.nickname, img_url: user.img_url } : {}
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A092D] text-white">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A092D] text-white p-6">
      <div className="absolute top-6 left-6">
        <h1 className="text-2xl font-bold">학습 페이지</h1>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {posts.map((post) => {
            const userInfo = getUserInfo(post.user_id)

            return (
              <div
                key={post.id}
                className="w-60 h-60 bg-[#2E3856] text-white rounded-lg shadow-lg"
              >
                <div className="w-full h-full flex flex-col p-3">
                  <h2 className="text-2xl font-semibold truncate mb-2">
                    {post.title}
                  </h2>

                  <div className="text-sm text-gray-300 flex items-center justify-between mb-4">
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
                        <Image
                          src="/bookmarkon.png"
                          alt="Bookmarked"
                          width={25}
                          height={25}
                        />
                      ) : (
                        <Image
                          src="/bookmarkoff.png"
                          alt="Not Bookmarked"
                          width={25}
                          height={25}
                        />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-center mt-6">
                    <div
                      className="text-2xl rounded-lg h-20 w-32 bg-[#282E3E] text-center text-white cursor-pointer hover:bg-[#3f475e] transition duration-300 flex items-center justify-center"
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
  )
}

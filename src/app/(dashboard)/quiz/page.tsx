'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { supabase } from '@/supabase/supabaseClient'

import { Tables } from '../../../../database.types'

type Word = {
  id: string
  word: string
  meaning: string
}

type Post = Tables<'posts'> & {
  words: Word[]
  user_id: string
}

type User = {
  id: string
  nickname: string
  img_url: string | null
}

const QuizListPage = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('id, title, words, user_id, created_at, description')

        if (postError) throw postError
        setPosts(postData as Post[])

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, nickname, img_url')

        if (userError) throw userError
        setUsers(userData as User[])
      } catch (err: any) {
        setError('데이터를 가져오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleNavigateToQuiz = (postId: string) => {
    router.push(`/quiz/${postId}`)
  }

  const getUserInfo = (userId: string) => {
    const user = users.find((user) => user.id === userId)
    return user
      ? { nickname: user.nickname, img_url: user.img_url }
      : { nickname: '알 수 없음', img_url: '/dingco.png' }
  }

  return (
    <div className="min-h-screen flex justify-center">
      <div className="max-w-custom w-full flex flex-col p-8 h-screen">
        <div className="flex items-center justify-center w-full mt-[60px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {/* 퀴즈풀기 제목 */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex justify-start">
              <h1 className="text-3xl font-bold mb-[10px]">퀴즈풀기</h1>
            </div>
            {posts.map((post) => {
              const userInfo = getUserInfo(post.user_id)
              return (
                <div
                  key={post.id}
                  className="w-56 h-56 bg-[#2E3856] rounded-lg shadow-lg cursor-pointer"
                  onClick={() => handleNavigateToQuiz(post.id)}
                >
                  <div className="w-full h-full flex flex-col p-6">
                    <h2 className="text-lg font-semibold truncate mb-2">
                      {post.title}
                    </h2>

                    <div className="text-sm flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Image
                          src={userInfo.img_url || '/dingco.png'}
                          alt="Profile"
                          width={35}
                          height={35}
                          className="rounded-full border"
                        />
                        <p>{userInfo.nickname}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center mt-6">
                      <div
                        className="text-lg rounded-lg bg-[#282E3E] text-center text-white flex items-center justify-center
                          cursor-pointer hover:bg-[#3f475e] transition duration-300
                          h-14 w-28 sm:h-16 sm:w-32 md:h-18 md:w-36 lg:h-18 lg:w-36"
                      >
                        {Array.isArray(post.words)
                          ? post.words.length
                          : '알 수 없음'}{' '}
                        단어
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

export default QuizListPage

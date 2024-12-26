'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/app/api/supabase'
import { useRouter } from 'next/navigation'
import { Tables } from '../../../database.types'

type Word = {
  id: string
  word: string
  meaning: string
}

type Post = Tables<'posts'> & {
  words: Word[]
  users: {
    nickname: string
  }
}

const QuizListPage = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            id,
            title,
            words,
            user_id,
            created_at,
            description,
            users!inner(nickname)
          `)

        if (error) throw error
        if (data) {
          const formattedData = data.map((post: any) => ({
            ...post,
            users: post.users[0],
          }))
          setPosts(formattedData as Post[])
        }
      } catch (err: any) {
        setError('데이터를 가져오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleNavigateToQuiz = (postId: string) => {
    router.push(`/quiz/${postId}`)
  }

  return (
    <div className="min-h-screen bg-[#0A092D] text-white flex">
      <div className="flex-1 ml-20 p-8 overflow-y-auto h-screen">
        <div className="relative flex flex-col items-center justify-center">
          {/* 퀴즈 리스트 페이지 제목 */}
          <div className="absolute top-14 left-40">
            <h1 className="text-3xl font-bold">퀴즈 풀기</h1>
          </div>

          {/* 카드 묶음 */}
          <div className="flex items-center justify-center w-full mt-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="w-56 h-56 bg-[#2E3856] text-white rounded-lg shadow-lg cursor-pointer"
                  onClick={() => handleNavigateToQuiz(post.id)}
                >
                  <div className="w-full h-full flex flex-col p-3">
                    <h2 className="text-lg font-semibold truncate mb-4">
                      {post.title}
                    </h2>

                    <div className="text-sm text-gray-300 flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <p>{post.users?.nickname || '알 수 없음'}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center mt-6">
                      <div
                        className="text-lg rounded-lg bg-[#282E3E] text-center text-white flex items-center justify-center
                          cursor-pointer hover:bg-[#3f475e] transition duration-300 
                          h-14 w-28 sm:h-16 sm:w-32 md:h-18 md:w-36 lg:h-18 lg:w-36"
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

export default QuizListPage

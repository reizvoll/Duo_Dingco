'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/supabase/supabase'
import { useRouter } from 'next/navigation'
import { Tables } from '../../../database.types'

// 타입 정의
type Word = {
  id: string
  word: string
  meaning: string
}

type Post = Tables<'posts'> & {
  words: Word[] // JSON 배열로 가정
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
        const { data, error } = await supabase.from('posts').select(`
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
          // users가 배열로 반환되면 첫 번째 항목만 사용
          const formattedData = data.map((post: any) => ({
            ...post,
            users: post.users[0], // 첫 번째 사용자를 가져옴
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
    <div className="quiz-list-page p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-left text-white">퀴즈 풀기</h1>
      </div>

      {loading && <p className="text-center text-white">로딩 중...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-4 bg-[#2E3856] rounded-lg shadow cursor-pointer"
              onClick={() => handleNavigateToQuiz(post.id)}
            >
              <h2 className="text-xl font-semibold text-white">{post.title}</h2>
              <p className="text-white">
                닉네임: {post.users?.nickname || '알 수 없음'}
              </p>
              <p className="text-white">
                단어 개수:{' '}
                {Array.isArray(post.words) ? post.words.length : '알 수 없음'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default QuizListPage

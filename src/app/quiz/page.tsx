'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/app/api/supabase' 
import { Tables } from '../../../database.types'

type Post = Tables<'posts'>

const QuizPage = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      setError(null)

      try {
        const { data, error } = await supabase
          .from('posts')
          .select('id, title, words, description')

        if (error) throw error
        if (data) {
          setPosts(data as Post[])
        }
      } catch (err: any) {
        setError('데이터를 가져오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleNext = () => {
    setCurrentWordIndex((prevIndex) => {
      const totalWords = posts[0]?.words.length || 0
      return (prevIndex + 1) % totalWords
    })
  }

  const currentWord = posts[0]?.words[currentWordIndex]

  return (
    <div className="quiz-page">
      {loading && <p className="text-center text-lg">로딩 중...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          <div className="flex justify-center items-center h-[175px]">
            {posts.map((post) => (
              <h1 key={post.id} className="text-4xl font-semibold">
                {post.title}
              </h1>
            ))}
          </div>
          <div className="mx-auto mt-10 w-[900px] h-[550px] bg-[#2E3856] text-white p-6 rounded-lg shadow-lg">
            <div className="posts-list space-y-6 text-center">
              {currentWord && (
                <div className="word space-y-4">
                  <p className="text-2xl font-bold">{currentWord.words}</p>
                  <p className="text-lg">{currentWord.meaning}</p>
                </div>
              )}
              <button
                onClick={handleNext}
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                다음
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default QuizPage

'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/supabase/supabaseClient'
import { useRouter } from 'next/navigation'
import { Post } from '@/types/commentTypes'

const HotLearnPage = () => {
  const [hotPosts, setHotPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchHotPosts = async () => {
      setLoading(true)
      setError(null)

      try {
        const { data, error } = await supabase
          .from('posts')
          .select(
            `
            id,
            created_at,
            title,
            description,
            words,
            user_id
          `,
          )
          .order('created_at', { ascending: false }) // 최신순
          .limit(4) // 최대 4개

        if (error) throw error

        setHotPosts(data || [])
      } catch (err: any) {
        setError('데이터를 가져오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchHotPosts()
  }, [])

  const handleNavigateToPost = (postId: string) => {
    router.push(`/learning/${postId}`) // 해당 학습 페이지로 이동
  }

  return (
    <div className="min-h-screen bg-[#0A092D] text-white flex">
      <div className="flex-1 ml-20 p-8 overflow-y-auto h-screen">
        <div className="relative flex flex-col items-center justify-center">
          {/* 🔥 최신 학습 리스트 제목 */}
          <div className="absolute top-10 left-8 sm:top-12 sm:left-16 md:top-14 md:left-32 lg:top-14 lg:left-40">
            <h1 className="text-3xl font-bold">🔥 최신 학습 리스트</h1>
          </div>

          {/* 카드 묶음 */}
          <div className="flex items-center justify-center w-full mt-32 sm:mt-36 md:mt-40 lg:mt-44">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {hotPosts.map((post) => (
                <div
                  key={post.id}
                  className="w-56 h-56 bg-[#2E3856] text-white rounded-lg shadow-lg cursor-pointer"
                >
                  <div className="w-full h-full flex flex-col p-3">
                    <h2 className="text-lg font-semibold truncate mb-4">
                      {post.title || '제목 없음'}
                    </h2>
                    <p className="text-sm text-gray-400 truncate mb-4">
                      {post.description || '설명 없음'}
                    </p>

                    <div className="flex items-center justify-center mt-6">
                      <div
                        className="text-lg rounded-lg bg-[#282E3E] text-center text-white flex items-center justify-center
                            cursor-pointer hover:bg-[#3f475e] transition duration-300 
                            h-14 w-28 sm:h-16 sm:w-32 md:h-18 md:w-36 lg:h-18 lg:w-36"
                        onClick={() => handleNavigateToPost(post.id)}
                      >
                        {post.words?.length || 0} 단어
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

export default HotLearnPage

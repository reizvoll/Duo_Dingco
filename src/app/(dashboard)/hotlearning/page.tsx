'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/supabase/supabaseClient'
import { useRouter } from 'next/navigation'
import { Post } from '@/types/commentTypes'
import { FaRegStar } from 'react-icons/fa6'
import { FaStar } from 'react-icons/fa6'
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
          .order('created_at', { ascending: false })

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
    router.push(`/learning/${postId}`)
  }

  return (
    <div className="min-h-screen bg-[#0A092D] text-white flex">
      <div className="flex-1 ml-20 p-20 overflow-y-auto h-screen">
        <div className="relative flex flex-col items-center justify-center">
          {/* 🔥오늘 작성된 따끈~한 단어 */}
          <div className="mb-8 w-full" style={{ position: 'relative' }}>
            <div
              className="text-3xl font-bold"
              style={{
                padding: 10,
                position: 'absolute',
                top: '0',
                left: '580px',
                // transform: 'translateX(-20px)',
              }}
            >
              🔥오늘 작성된 따끈~한 단어
            </div>
          </div>

          {/* 카드 묶음 */}
          <div className="flex items-center justify-center w-full">
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

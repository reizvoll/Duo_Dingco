'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/supabase/supabaseClient'
import { deletePostById } from '@/app/api/post/deleting'
import { useAuthStore } from '@/store/auth'
import { FaCircleArrowLeft, FaCircleArrowRight } from 'react-icons/fa6'
import Swal from 'sweetalert2'
import { Post } from '@/types/createCardListTypes'

// 작성한 게시글 가져오기
export async function fetchMyPosts(userId: string | null): Promise<Post[]> {
  if (!userId) return [] // userId가 없을 경우 빈 배열 반환
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, words, created_at')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching user posts:', error.message)
    return []
  }

  return data.map((post) => ({
    id: post.id,
    title: post.title,
    wordCount: Array.isArray(post.words) ? post.words.length : 0,
    created_at: post.created_at || 'Unknown',
  }))
}

export default function MyPageCards() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const router = useRouter()

  const [currentIndex, setCurrentIndex] = useState(0)
  const maxVisibleCards = 4

  const userId = user?.id || null

  // 게시글 가져오기
  const {
    data: posts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['userPosts', userId],
    queryFn: () => fetchMyPosts(userId), // userId가 없으면 fetchMyPosts에서 빈 배열 반환
    refetchOnWindowFocus: false, // 선택적으로 재조회 방지
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return deletePostById(id)
    },
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: '삭제 완료',
        text: '게시글이 성공적으로 삭제되었습니다.',
        confirmButtonText: '확인',
      }).then(() => {
        queryClient.invalidateQueries({ queryKey: ['userPosts', userId] })
      })
    },
    onError: () => {
      Swal.fire({
        icon: 'error',
        title: '삭제 실패',
        text: '게시글 삭제에 실패했습니다.',
        confirmButtonText: '확인',
      })
    },
  })

  const handleDeletePost = async (id: string) => {
    const result = await Swal.fire({
      title: '정말 삭제하시겠습니까?',
      text: '삭제하면 데이터를 복구할 수 없습니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '예, 삭제합니다!',
      cancelButtonText: '취소',
    })

    if (result.isConfirmed) {
      deleteMutation.mutate(id)
    }
  }

  const handleGoToDetails = (id: string) => router.push(`/comment/${id}`)

  // 로딩 상태 처리
  if (isLoading) {
    return <div>Loading...</div>
  }

  // 오류 상태 처리
  if (isError) {
    return (
      <div className="flex flex-col items-center mt-12">
        <h1 className="text-3xl font-bold text-white mb-8">
          데이터를 불러오는 중 오류가 발생했습니다.
        </h1>
      </div>
    )
  }

  // 게시글이 없을 경우
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center mt-12">
        <h1 className="text-3xl font-bold text-white mb-8">
          작성한 게시글이 없습니다.
        </h1>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center mt-12">
      <h1 className="text-3xl font-bold text-white mb-8">내가 작성한 카드</h1>

      <div className="flex items-center gap-4">
        {/* 왼쪽버튼 */}
        <button
          onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
          className={`p-2 ${currentIndex === 0 ? 'text-gray-500' : 'text-white'}`}
        >
          <FaCircleArrowLeft size={36} />
        </button>

        {/* 본문 내용 */}
        {posts
          .slice(currentIndex, currentIndex + maxVisibleCards)
          .map((myPost) => (
            <div
              key={myPost.id}
              className="w-56 h-56 bg-[#2E3856] rounded-lg shadow-lg p-4 flex flex-col justify-between relative"
            >
              <div>
                <div className="cardContent">
                  <h2 className="text-white text-lg font-semibold truncate mb-2">
                    {myPost.title}
                  </h2>

                  <p className="text-xs text-gray-400 mb-4">
                    작성일: {new Date(myPost.created_at).toLocaleDateString()}
                  </p>
                  <div className="flex items-center justify-center m-6">
                    <div
                      className="text-lg rounded-lg bg-[#282E3E] text-center text-white flex items-center justify-center
                                cursor-pointer hover:bg-[#3f475e] transition duration-300 
                                h-14 w-28 sm:h-16 sm:w-32 md:h-18 md:w-36 lg:h-18 lg:w-36"
                      onClick={() => handleGoToDetails(myPost.id)}
                    >
                      {myPost.wordCount || 0} 단어
                    </div>
                  </div>
                </div>
              </div>

              {/* 수정 삭제 버튼 */}
              <div className="flex justify-between gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => handleDeletePost(myPost.id)}
                  className="w-[100px] p-2 font-bold rounded-xl border-2 hover:bg-red-700 text-white"
                >
                  삭제하기
                </button>

                <button
                  type="button"
                  onClick={() => router.push(`/update/${myPost.id}`)}
                  className="w-[100px] p-2 font-bold rounded-xl border-2 text-white hover:bg-blue-700"
                >
                  수정하기
                </button>
              </div>
            </div>
          ))}

        {/* 오른쪽 버튼 */}
        <button
          onClick={() =>
            currentIndex < posts.length - maxVisibleCards &&
            setCurrentIndex(currentIndex + 1)
          }
          disabled={currentIndex >= posts.length - maxVisibleCards}
          className={`p-2 ${currentIndex >= posts.length - maxVisibleCards ? 'text-gray-500' : 'text-white'}`}
        >
          <FaCircleArrowRight size={36} />
        </button>
      </div>
    </div>
  )
}
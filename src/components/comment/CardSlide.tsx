'use client'

import { useQuery } from '@tanstack/react-query'

import { FaCircleArrowRight, FaCircleArrowLeft } from 'react-icons/fa6'
import { useState } from 'react'
import { fetchPostList } from '@/app/api/comment/postList'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

export default function CardSlide() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)

  const {
    data: postList,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['postList'],
    queryFn: fetchPostList,
  })

  if (isPending) {
    return <div>Loading...</div>
  }

  if (isError || !postList) {
    return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>
  }

  const maxVisibleCards = 4

  const slideToLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const slideToRight = () => {
    if (currentIndex < postList.length - 4) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleWordClick = (postId: string) => {
    Swal.fire({
      title: '문제 풀이 페이지로 이동하시겠습니까?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '이동',
      cancelButtonText: '취소',
    }).then((result) => {
      if (result.isConfirmed) {
        router.push(`/quiz/${postId}`)
      }
    })
  }

  return (
    <div className="flex m-8 items-center gap-4">
      {/* 좌측 버튼 */}
      <button
        type="button"
        onClick={slideToLeft}
        disabled={currentIndex === 0}
        className={`${currentIndex === 0 ? 'text-gray-400' : 'text-white'}`}
      >
        <FaCircleArrowLeft size={24} />
      </button>

      {/* 슬라이드 리스트 */}
      <div className="flex gap-8 justify-evenly w-full">
        {postList
          .slice(currentIndex, currentIndex + maxVisibleCards)
          .map((post) => (
            <div
              key={post.id}
              className="flex-shrink-0 w-[20%] h-[250px] bg-[#2E3856] rounded-lg 
              flex flex-col items-center justify-center"
            >
              <div
                className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-4
                hover:bg-slate-800 cursor-pointer"
                onClick={() => handleWordClick(post.id)}
              >
                {post.wordCount || 0}단어
              </div>
              <p className="text-white p-2 text-sm font-bold break-all whitespace-pre-wrap ">
                {post.title}
              </p>
            </div>
          ))}
      </div>

      {/* 우측 버튼 */}
      <button
        type="button"
        onClick={slideToRight}
        disabled={currentIndex >= postList.length - 4}
        className={` ${
          currentIndex >= postList.length - 4 ? 'text-gray-400' : 'text-white'
        }`}
      >
        <FaCircleArrowRight size={24} />
      </button>
    </div>
  )
}

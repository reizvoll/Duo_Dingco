'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/supabase/supabaseClient'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { FaStar, FaRegStar } from 'react-icons/fa'
import { FaCircleArrowLeft, FaCircleArrowRight } from 'react-icons/fa6'
import { Bookmarks } from '@/types/CommentTypes'
import { useAuthStore } from '@/store/auth'
import Swal from 'sweetalert2'

// 림졍🔥 여기도 설명필요해? 일단 달아볼게
export default function LearnDetailPage({
  params,
}: {
  params: { id: string }
}) {
  //clearUser는 Zustand 스토어에서 유저 정보를 초기화(세션이 만료되거나 유효하지 않을 때)
  const { user, setUser, clearUser } = useAuthStore()
  const [posts, setPosts] = useState<Bookmarks | null>(null) // 게시글 데이터
  const [currentIndex, setCurrentIndex] = useState(0) // 현재 카드 인덱스
  const [isFlipped, setIsFlipped] = useState(false) // 카드 뒤집힘 상태
  const [error, setError] = useState<string | null>(null) // 에러 메시지
  // 페이지 라우팅 관련
  const { id } = params // 동적 세그먼트에서 받은 게시글 ID
  const router = useRouter()
  const searchParams = useSearchParams()

  // 뒤로가기 버튼 동작
  const handleBack = () => {
    router.push('/learning')
  }
  // 게시글 데이터 가져오기
  const fetchData = async () => {
    try {
      // 세션과 사용자 확인
      if (!user) {
        setError('사용자 세션이 없습니다.')
        return
      }

      // Supabase에서 데이터 가져오기
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select(
          'id, title, description, words, user_id, bookmarks(post_id, user_id)',
        )
        .eq('id', id)
        .single()

      // 데이터 요청 에러 처리
      if (postError) {
        console.error('데이터 요청 오류:', postError)
        setError('게시글 데이터를 가져오는 중 오류가 발생했습니다.')
        return
      }
      console.log('user', user)
      // 단어 데이터 파싱
      const parsedWords =
        typeof postData.words === 'string'
          ? JSON.parse(postData.words)
          : postData.words

      // 북마크 상태 확인
      const isBookmarked = postData.bookmarks.some(
        (bookmark) => bookmark.user_id === user.id,
      )

      // 상태 업데이트
      setPosts({ ...postData, words: parsedWords, isBookmarked })
      setError(null) // 오류 상태 초기화
    } catch (err) {
      console.error('fetchData 오류:', err)
      setError('데이터를 가져오는 중 오류 발생')
    }
  }
  // 세션 확인 및 유저 정보 설정
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error || !data.session) {
        clearUser() // 세션이 없으면 유저 초기화
        router.push('/auth/login')
        return
      }
      // 세션이 있으면 유저 정보 설정
      const supabaseUser = data.session.user
      if (supabaseUser) {
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email,
          img_url: supabaseUser.user_metadata?.img_url || '',
        })
      }
    }

    checkSession()
  }, [router, setUser, clearUser])
  // 유저가 있는 경우 데이터 가져오기
  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user, id]) // user가 업데이트된 후 fetchData 실행
  // 북마크 토글 (추가/삭제)
  const toggleBookmark = async (id: string) => {
    if (!posts || !user) {
      router.push('/auth/login')
      return
    }

    const isBookmarked = posts.isBookmarked

    try {
      // 북마크 상태 업데이트
      if (isBookmarked) {
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', id)
      } else {
        await supabase.from('bookmarks').insert({
          user_id: user.id,
          post_id: id,
        })
      }

      // 로컬 상태 업데이트
      setPosts((prev) =>
        prev ? { ...prev, isBookmarked: !isBookmarked } : null,
      )
    } catch (err) {
      setError('북마크 처리 중 오류 발생')
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A092D] text-white">
        <p>{error}</p>
      </div>
    )
  }

  if (!posts) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A092D] text-white">
        <p>로딩 중...</p>
      </div>
    )
  }

  const totalCards = posts.words.length

  const goToNextCard = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  const goToPrevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  const flipCard = () => {
    setIsFlipped(!isFlipped)
  }
  const handleComplete = async () => {
    try {
      await Swal.fire({
        title: '🎉 학습 완료!',
        text: '모든 카드를 학습하셨습니다!',
        icon: 'success',
        confirmButtonText: '확인',
      })
      router.push('/learning')
    } catch (err) {
      console.error('Swal 오류:', err)
    }
  }
  return (
    <div className="min-h-screen bg-[#0A092D] text-white p-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{posts.title}</h1>
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleBookmark(posts.id)
            }}
          >
            {posts.isBookmarked ? (
              <FaStar className="w-[30px] h-[30px]" />
            ) : (
              <FaRegStar className="w-[30px] h-[30px]" />
            )}
          </button>
        </div>
        <p className="text-gray-400">
          {posts.description || '설명이 들어갈 곳입니다.'}
        </p>
        <div className="flex items-center p-3">
          <Image
            src={user?.img_url || '/dingco.png'}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="p-2">{user?.nickname || 'Unknown User'}</span>
        </div>
      </div>

      <div
        className="relative w-full max-w-3xl mt-2 h-[300px] rounded-lg shadow-lg cursor-pointer"
        onClick={flipCard}
        style={{ perspective: '1000px' }}
      >
        <div
          className={`w-90 h-80 rounded-lg bg-white transform transition-transform duration-700 mt-0`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          <div
            className="absolute w-full h-full flex items-center justify-center text-black bg-white rounded-lg"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="text-4xl font-bold">
              {posts.words[currentIndex]?.word || '단어 없음'}
            </p>
          </div>

          <div
            className="absolute w-full h-full text-2xl flex items-center justify-center text-black bg-gray-100 rounded-lg"
            style={{
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
            }}
          >
            <p className="text-lg p-10">
              {posts.words[currentIndex]?.meaning || '정의 없음'}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl mt-6 flex items-center justify-center">
        <button
          className={`p-2 transform transition duration-300 ${
            currentIndex === 0
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:scale-125'
          }`}
          onClick={goToPrevCard}
        >
          <FaCircleArrowLeft className="w-[30px] h-[30px]" />
        </button>
        <p className="p-10 text-2xl">
          {currentIndex + 1}/{totalCards}
        </p>
        <button
          className={`p-2 transform transition duration-300 ${
            currentIndex === totalCards - 1
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:scale-125'
          }`}
          onClick={goToNextCard}
        >
          <FaCircleArrowRight className="w-[30px] h-[30px]" />
        </button>
      </div>
      {/* 내가 야심차게 준비한 부분!! 마지막 장수일 때, 완료하기 버튼이 뜨면서 클릭 시 학습 완료!알럿! */}
      {currentIndex === totalCards - 1 ? (
        <button
          className="px-4 py-2 bg-[#282E3E] text-white rounded hover:bg-[#3f475e] transition duration-300"
          onClick={handleComplete}
        >
          완료하기
        </button>
      ) : (
        <button
          className="px-4 py-2 bg-[#282E3E] text-white rounded hover:bg-[#3f475e] transition duration-300"
          onClick={handleBack}
        >
          뒤로가기
        </button>
      )}
    </div>
  )
}

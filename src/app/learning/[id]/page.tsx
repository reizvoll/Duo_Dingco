'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/app/api/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Word = {
  id: string // 단어 ID
  word: string // 단어
  definition: string // 단어의 뜻
}

type Post = {
  id: string // 학습 리스트 ID
  title: string // 학습 리스트 제목
  description: string // 학습 리스트 설명
  words: Word[] // 단어 목록
  user_id: string // 작성자 ID
}

type User = {
  id: string // 유저 ID
  nickname: string // 유저 닉네임
  img_url: string // 유저 프로필 이미지 URL
  created_at: string // 유저 생성 날짜
}

export default function QuizDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()

  const [posts, setPosts] = useState<Post | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch post data
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('id, title, description, words, user_id')
          .eq('id', id)
          .single()

        if (postError) {
          setError('게시글 데이터를 가져오는 중 오류가 발생했습니다.')
          console.error('Supabase posts fetch error:', postError.message)
          return
        }

        // Parse words
        const parsedWords =
          typeof postData.words === 'string'
            ? JSON.parse(postData.words)
            : postData.words

        // Fetch user data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, nickname, img_url, created_at')
          .eq('id', postData.user_id)
          .single()

        if (userError) {
          setError('유저 데이터를 가져오는 중 오류가 발생했습니다.')
          console.error('Supabase users fetch error:', userError.message)
          return
        }

        setPosts({ ...postData, words: parsedWords })
        setUser(userData)
      } catch (err) {
        setError('데이터를 가져오는 중 문제가 발생했습니다.')
        console.error(err)
      }
    }

    fetchData()
  }, [id])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A092D] text-white">
        <p>{error}</p>
      </div>
    )
  }

  if (!posts || !user) {
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

  const toggleBookmark = (id: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, isBookmarked: !post.isBookmarked } : post,
      ),
    )
  }

  // justify-content: center;
  return (
    <div className="min-h-screen bg-[#0A092D] text-white p-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{posts.title}</h1>
        </div>
        <div className="flex flex-row-reverse">
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleBookmark(posts.id)
            }}
          >
            {posts.isBookmarked ? (
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
        <p className="text-gray-400">
          {posts.description || '설명이 들어갈 곳입니다.'}
        </p>
        <div className="flex items-center justify-between mt-4">
          <p className="flex items-center p-3">
            <Image
              src={user.img_url || '/default-profile.png'}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full"
            />
            <p className="p-2">{user.nickname}</p>
          </p>
          등록일-{user.created_at}
        </div>
      </div>
      {/* display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center; */}
      <div
        className="relative w-full max-w-3xl mt-2 h-[300px] rounded-lg shadow-lg cursor-pointer "
        onClick={flipCard}
        style={{
          perspective: '1000px', // 원근 효과
        }}
      >
        {/* 카드 전체 컨테이너 */}
        <div
          className={`w-90 h-80 rounded-lg bg-white transform transition-transform duration-700 mt-0 `}
          style={{
            transformStyle: 'preserve-3d', // 3D 효과를 유지
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)', // 회전 상태
          }}
        >
          {/* 카드 앞면 */}
          <div
            className="absolute w-full h-full flex items-center justify-center text-black bg-white rounded-lg"
            style={{
              backfaceVisibility: 'hidden', // 뒷면 숨기기
            }}
          >
            <p className="text-4xl font-bold">
              {posts.words[currentIndex]?.word || '단어 없음'}
            </p>
          </div>

          {/* 카드 뒷면 */}
          <div
            className="absolute w-full h-full text-2xl flex items-center justify-center text-black bg-gray-100 rounded-lg"
            style={{
              transform: 'rotateY(180deg)', // 기본 180도 회전
              backfaceVisibility: 'hidden', // 앞면 숨기기
            }}
          >
            <p className="text-lg">
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
          <Image src="/left.png" alt="Previous" width={25} height={25} />
        </button>
        <p className="p-10">
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
          <Image src="/right.png" alt="Next" width={25} height={25} />
        </button>
      </div>

      <div className="mt-10">
        <button
          className="px-4 py-2 bg-[#282E3E] text-white rounded hover:bg-[#3f475e] transition duration-300"
          onClick={() => router.push('/learning')}
        >
          뒤로가기
        </button>
      </div>
    </div>
  )
}

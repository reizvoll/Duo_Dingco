'use client'

import React, { useEffect, useState } from 'react'

type Word = {
  id: string
  words: string
  meaning: string
}

type Post = {
  id: string
  title: string
  words: Word[]
  description: string
}

const mockPosts: Post[] = [
  {
    id: '1',
    title: '자바 스크립트 단어 모음',
    description: '자바 스크립트의 기본 변수 저장 방법입니다.',
    words: [
      { id: '1', words: 'Let', meaning: '변수 저장' },
      { id: '2', words: 'Var', meaning: '변수 저장 2' },
    ],
  },
]

const QuizPage = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0) // 현재 단어 인덱스

  useEffect(() => {
    setPosts(mockPosts)
  }, [])

  const handleNext = () => {
    setCurrentWordIndex((prevIndex) => {
      const totalWords = posts[0]?.words.length || 0
      return (prevIndex + 1) % totalWords // 순환되도록 설정
    })
  }

  const currentWord = posts[0]?.words[currentWordIndex] // 현재 표시할 단어

  return (
    <div className="quiz-page">
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
    </div>
  )
}

export default QuizPage

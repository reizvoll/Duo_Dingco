'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/supabase/supabase'
import { useParams } from 'next/navigation'
import { Tables } from '../../../../database.types'

type Word = {
  word: string
  meaning: string
}

type Post = Tables<'posts'> & {
  words: Word[]
}

const QuizPage = () => {
  const { id } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentOptions, setCurrentOptions] = useState<Word[]>([])
  const [allWords, setAllWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [allWordsResponse, postResponse] = await Promise.all([
          supabase.from('posts').select('words'),
          supabase
            .from('posts')
            .select('id, title, words, description')
            .eq('id', id)
            .single(),
        ])

        if (allWordsResponse.error) throw allWordsResponse.error
        if (postResponse.error) throw postResponse.error

        const mergedWords = allWordsResponse.data
          ?.map((post) => post.words)
          .flat() as Word[]

        setAllWords(mergedWords)

        const post = postResponse.data as Post
        setPost(post)

        if (mergedWords && post.words.length > 0) {
          setRandomOptions(post.words, post.words[0], mergedWords)
        }
      } catch (err: any) {
        setError('데이터를 가져오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchData()
  }, [id])

  const setRandomOptions = (
    postWords: Word[],
    currentWord: Word,
    allWords: Word[],
  ) => {
    const validWords = allWords.filter(
      (word) => word && word.word && word.meaning,
    )
    const otherWords = validWords.filter(
      (word) => word.word !== currentWord.word,
    )
    const shuffledWords = [...otherWords].sort(() => 0.5 - Math.random())
    const options = [currentWord, ...shuffledWords.slice(0, 3)].sort(
      () => 0.5 - Math.random(),
    )
    setCurrentOptions(options)
  }

  const handleNext = () => {
    setCurrentWordIndex((prevIndex) => {
      const totalWords = post?.words.length || 0
      const nextIndex = (prevIndex + 1) % totalWords
      const nextWord = post?.words[nextIndex]
      if (nextWord) setRandomOptions(post.words, nextWord, allWords)
      return nextIndex
    })
  }

  const currentWord = post?.words?.[currentWordIndex] || null

  return (
    <div className="quiz-page relative flex flex-col items-center min-h-screen">
      {!loading && !error && post && (
        <h1 className="absolute top-8 text-5xl font-bold text-center text-white">
          {post.title}
        </h1>
      )}

      <div className="flex flex-grow items-center justify-center w-full p-6">
        {!loading && !error && post && (
          <div className="relative w-[900px] h-[650px] bg-[#2E3856] p-8 rounded-lg shadow-lg text-white flex flex-col justify-between">
            <div className="quiz-description mb-6 text-center">
              <p className="text-2xl">{post.description}</p>
            </div>
            <div className="quiz-container flex-grow flex items-center justify-center p-8 rounded-lg">
              {currentWord && (
                <div className="word-content text-center">
                  <p className="text-4xl mt-4">{currentWord.meaning}</p>
                </div>
              )}
            </div>
            <div className="options-container grid grid-cols-2 gap-10 mt-4 mb-20">
              {currentOptions.map((option, index) => (
                <div
                  key={index}
                  className="option text-white border border-white p-4 rounded-lg shadow text-center font-bold"
                >
                  {option.word}
                </div>
              ))}
            </div>
            <button
              onClick={handleNext}
              className="absolute bottom-4 right-4 px-6 py-3 text-white border border-white rounded-lg hover:text-gray-200"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuizPage

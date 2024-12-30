'use client'

import { useEffect, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { Tables } from '../../../../../database.types'

import {
  getSession,
  fetchUserData,
  fetchPostData,
} from '@/app/api/quiz/fetchDataQuiz'

import { showQuizCompletionAlert } from '@/utils/quizAlert'
import { goToNextQuestion, updateUserExpAndLevel } from '@/utils/quizHelpers'
import { showIncorrectModal } from '@/utils/quizModal'

type Word = {
  word: string
  meaning: string
}

type Post = Tables<'posts'> & {
  words: Word[]
}

const QuizPage = () => {
  const router = useRouter()
  const { id } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentOptions, setCurrentOptions] = useState<Word[]>([])
  const [allWords, setAllWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<Word | null>(null)
  const [user, setUser] = useState<{
    id: string
    Exp: number
    Lv: number
  } | null>(null)
  const [correctAnswers, setCorrectAnswers] = useState<number>(0)
  const [incorrectWords, setIncorrectWords] = useState<Word[]>([])
  const [isAnswered, setIsAnswered] = useState(false)

  // 컴포넌트가 로드 되었을때 데이터를 가져옴
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const session = await getSession()
        if (!session) {
          setError('로그인이 필요합니다.')
          return
        }
        // 사용자 데이터 가져오고
        const userData = await fetchUserData(session.user.id)
        setUser(userData)

        const idString = Array.isArray(id) ? id[0] : id
        const { mergedWords, post } = await fetchPostData(idString)

        // 유효한 단어만 필터링하여 Word[]로 변환
        const validatedWords: Word[] = mergedWords.filter(
          (word): word is Word =>
            word !== null &&
            typeof word === 'object' &&
            'word' in word &&
            'meaning' in word,
        )

        setAllWords(validatedWords)
        setPost(post)
        // 단어가 존재한다면??  선택지를 초기화
        if (validatedWords && post.words.length > 0) {
          setRandomOptions(post.words, post.words[0], validatedWords)
        }
      } catch (error) {
        console.error(error)
        setError('데이터를 가져오는 중 문제가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchData() // ID가 존재할 때 데이터를 가져올 수 있도록 수정
  }, [id])

  // 현재 질문에 대한 선택지를 랜덤으로 생성하는 함수
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
    // 중복되지 않는 단어를 선택해 랜덤 정렬
    const uniqueOptions = otherWords
      .filter(
        (word, index, self) =>
          self.findIndex((w) => w.word === word.word) === index,
      )
      .sort(() => 0.5 - Math.random())
    // 현재 단어와 선택지 3개를 추가해서서 랜덤 정렬
    const options = [currentWord, ...uniqueOptions.slice(0, 3)].sort(
      () => 0.5 - Math.random(),
    )
    setCurrentOptions(options)
  }
  // 다음 질문으로 이동하거나 퀴즈를 완료 처리 해주는 함수
  const handleNext = async () => {
    if (!user || !selectedAnswer || !currentWord) return
    // 정답 여부 확인하는 변수
    const isCorrect = selectedAnswer.word === currentWord.word
    const isLastQuestion = currentWordIndex === (post?.words.length || 1) - 1

    const updatedIncorrectWords = isCorrect
      ? incorrectWords
      : [...incorrectWords, currentWord]
    // 마지막 질문일 경우 퀴즈 완료 처리하는 로직
    if (isLastQuestion) {
      if (!isCorrect) {
        setIncorrectWords(updatedIncorrectWords)
      }

      await showQuizCompletionAlert(
        user.Lv,
        user.Exp,
        post?.words.length || 0,
        correctAnswers + (isCorrect ? 1 : 0),
        () => router.push('/quiz'),
        () => handleShowIncorrectModal(updatedIncorrectWords), // 틀린단어 모달 표시
      )

      return
    }

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1)
      await updateUserExpAndLevel(user, setUser)
    } else {
      setIncorrectWords(updatedIncorrectWords)
    }
    // 다음 질문으로 이동~~
    setSelectedAnswer(null)
    goToNextQuestion(
      currentWordIndex,
      setCurrentWordIndex,
      post?.words || [],
      setRandomOptions,
      allWords,
    )
    setIsAnswered(false)
  }
  // 틀린 단어 모달
  const handleShowIncorrectModal = (words: Word[]) => {
    showIncorrectModal(
      words,
      user,
      post?.words.length || 0,
      correctAnswers,
      () => router.push('/quiz'),
      () => router.push('/learning'),
    )
  }

  const handleBack = () => {
    router.push('/quiz')
  }
  // 사용자가 답변을 선택했을 때 처리
  const handleSelectAnswer = (option: Word) => {
    if (!isAnswered) {
      setSelectedAnswer(option)
      setIsAnswered(true)
    }
  }
  // 현재 질문 데이터 가져오기
  const currentWord = post?.words?.[currentWordIndex] || null
  // 텍스트 길이를 제한하는 함수, 각각 타이틀, 워드, 미닝에 적용되어 있음
  const truncateText = (text: string, maxLength: number): string => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  return (
    <div className="quiz-page relative flex flex-col items-center min-h-screen scale-90 origin-center max-w-custom mx-auto">
      {!loading && !error && post && (
        <>
          {/* 제목 + 뒤로가기 버튼 컨테이너 */}
          <div className="flex items-center justify-between w-full absolute top-8 px-40">
            <button
              onClick={handleBack}
              className="px-6 py-3 text-white border border-white rounded-lg hover:text-gray-200"
            >
              뒤로가기
            </button>

            <h1 className="text-4xl font-bold text-center text-white flex-grow">
              {truncateText(post.title, 30)}
            </h1>

            <div className="w-[120px]">{/* 우측 여백 조절용 */}</div>
          </div>

          {/* 게이지 바 섹션 */}
          <div className="absolute top-32 w-[60%] flex flex-col items-center mb-12">
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-white text-lg font-bold px-4 py-2 border border-white rounded-lg">
                0
              </span>

              <span className="text-white text-lg font-bold px-4 py-2 border border-white rounded-lg">
                {post.words.length}
              </span>
            </div>

            <div className="w-full bg-gray-400 rounded-full h-6 relative">
              <div
                className="bg-green-500 h-6 rounded-full"
                style={{
                  width: `${((currentWordIndex + 1) / post.words.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </>
      )}

      {/* 퀴즈 카드 섹션 */}
      <div className="flex flex-grow items-center justify-center w-full p-12 mt-48">
        {!loading && !error && post && (
          <div className="relative w-[900px] h-[650px] bg-[#2E3856] p-8 rounded-lg shadow-lg text-white flex flex-col justify-between">
            <div className="quiz-description mb-6 text-center">
              <p className="text-3xl mt-24">
                {currentWord?.meaning && truncateText(currentWord.meaning, 100)}
              </p>
            </div>

            <div className="options-container grid grid-cols-2 gap-10 mt-4 mb-20">
              {currentOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectAnswer(option)}
                  className={`option text-white border-4 p-4 rounded-lg shadow text-center font-bold cursor-pointer ${
                    selectedAnswer
                      ? option.word === currentWord?.word
                        ? 'border-green-500'
                        : selectedAnswer.word === option.word
                          ? 'border-red-500'
                          : 'border-white'
                      : 'border-white'
                  }`}
                >
                  {truncateText(option.word, 40)}
                </div>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className={`absolute bottom-4 right-4 px-6 py-3 text-white border border-white rounded-lg hover:text-gray-200 ${
                !selectedAnswer ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {currentWordIndex === (post?.words.length || 1) - 1
                ? '완료'
                : '다음'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuizPage

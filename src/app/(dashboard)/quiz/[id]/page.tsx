'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Tables } from '@/types/database.types';
import { getSession, fetchUserData, fetchPostData } from '@/app/api/quiz/fetchDataQuiz';
import { showQuizCompletionAlert } from '@/utils/quizAlert';
import { goToNextQuestion, updateUserExpAndLevel } from '@/utils/quizHelpers';
import { showIncorrectModal } from '@/utils/quizModal';

type Word = {
  word: string;
  meaning: string;
};

type Post = Tables<'posts'> & {
  words: Word[];
};

const QuizPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentOptions, setCurrentOptions] = useState<Word[]>([]);
  const [allWords, setAllWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<Word | null>(null);
  const [user, setUser] = useState<{ id: string; Exp: number; Lv: number } | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [incorrectWords, setIncorrectWords] = useState<Word[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const session = await getSession();
        if (!session) {
          setError('로그인이 필요합니다.');
          return;
        }

        const userData = await fetchUserData(session.user.id);
        setUser(userData);

        const idString = Array.isArray(id) ? id[0] : id;
        const { mergedWords, post } = await fetchPostData(idString);
        setAllWords(mergedWords);
        setPost(post);

        if (mergedWords && post.words.length > 0) {
          setRandomOptions(post.words, post.words[0], mergedWords);
        }
      } catch (error) {
        console.error(error);
        setError('데이터를 가져오는 중 문제가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const setRandomOptions = (postWords: Word[], currentWord: Word, allWords: Word[]) => {
    const validWords = allWords.filter((word) => word && word.word && word.meaning);
    const otherWords = validWords.filter((word) => word.word !== currentWord.word);
    const uniqueOptions = otherWords.filter(
      (word, index, self) => self.findIndex((w) => w.word === word.word) === index
    ).sort(() => 0.5 - Math.random());
    const options = [currentWord, ...uniqueOptions.slice(0, 3)].sort(() => 0.5 - Math.random());
    setCurrentOptions(options);
  };

  const handleNext = async () => {
    if (!user || !selectedAnswer || !currentWord) return;

    const isCorrect = selectedAnswer.word === currentWord.word;
    const isLastQuestion = currentWordIndex === (post?.words.length || 1) - 1;

    const updatedIncorrectWords = isCorrect ? incorrectWords : [...incorrectWords, currentWord];

    if (isLastQuestion) {
      if (!isCorrect) {
        setIncorrectWords(updatedIncorrectWords);
      }

      await showQuizCompletionAlert(
        user.Lv,
        user.Exp,
        post?.words.length || 0,
        correctAnswers + (isCorrect ? 1 : 0),
        () => router.push('/quiz'),
        () =>
          handleShowIncorrectModal(updatedIncorrectWords)
      );

      return;
    }

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      await updateUserExpAndLevel(user, setUser);
    } else {
      setIncorrectWords(updatedIncorrectWords);
    }

    setSelectedAnswer(null);
    goToNextQuestion(currentWordIndex, setCurrentWordIndex, post?.words || [], setRandomOptions, allWords);
    setIsAnswered(false);
  };

  const handleShowIncorrectModal = (words: Word[]) => {
    showIncorrectModal(
      words,
      user,
      post?.words.length || 0,
      correctAnswers,
      () => router.push('/quiz'),
      () => router.push('/learning')
    );
  };

  const handleBack = () => {
    router.push('/quiz'); // 퀴즈 리스트로 이동
  };

  const handleSelectAnswer = (option: Word) => {
    if (!isAnswered) {
      setSelectedAnswer(option);
      setIsAnswered(true);
    }
  };

  const currentWord = post?.words?.[currentWordIndex] || null;

  return (
    <div className="quiz-page relative flex flex-col items-center min-h-screen">
      {!loading && !error && post && (
        <>
          <h1 className="absolute top-8 text-4xl font-bold text-center text-white mt-4">
            {post.title}
          </h1>

          <div className="absolute top-28 w-[46%] flex items-center justify-between mb-12">
            <span className="text-white text-lg font-bold px-4 py-2 border border-white rounded-lg">
              0
            </span>

            <div className="flex-1 mx-4 bg-gray-400 rounded-full h-4 relative">
              <div
                className="bg-green-500 h-4 rounded-full"
                style={{
                  width: `${((currentWordIndex + 1) / post.words.length) * 100}%`,
                }}
              ></div>
            </div>

            <span className="text-white text-lg font-bold px-4 py-2 border border-white rounded-lg">
              {post.words.length}
            </span>
          </div>
        </>
      )}

      <button
        onClick={handleBack}
        className="absolute top-4 left-4 px-6 py-3 ml-80 mt-24 text-white border border-white rounded-lg hover:text-gray-200"
      >
        뒤로가기
      </button>

      <div className="flex flex-grow items-center justify-center w-full p-12 mt-12">
        {!loading && !error && post && (
          <div className="relative w-[900px] h-[650px] bg-[#2E3856] p-8 rounded-lg shadow-lg text-white flex flex-col justify-between">
            <div className="quiz-description mb-6 text-center">
              <p className="text-3xl mt-24">{currentWord?.meaning}</p>
            </div>

            <div className="options-container grid grid-cols-2 gap-10 mt-4 mb-20">
              {currentOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectAnswer(option)}
                  className={`option text-white border-4 p-4 rounded-lg shadow text-center font-bold cursor-pointer ${selectedAnswer
                      ? option.word === currentWord?.word
                        ? 'border-green-500'
                        : selectedAnswer.word === option.word
                          ? 'border-red-500'
                          : 'border-white'
                      : 'border-white'
                    }`}
                >
                  {option.word}
                </div>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className={`absolute bottom-4 right-4 px-6 py-3 text-white border border-white rounded-lg hover:text-gray-200 ${!selectedAnswer ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {currentWordIndex === (post?.words.length || 1) - 1 ? '완료' : '다음'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;

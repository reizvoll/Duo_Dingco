'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { supabase } from '@/supabase/supabaseClient';
import { Tables } from '@/types/database.types';
import { getSession, fetchUserData, fetchPostData } from '@/app/api/quiz/fetchDataQuiz';


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

    if (isLastQuestion) {
      Swal.fire({
        title: '퀴즈 완료!',
        html: `
          <p>현재 레벨: <strong>${user.Lv}</strong></p>
          <p>현재 경험치: <strong>${user.Exp}/100</strong></p>
          <p>${post?.words.length}문제 중 <strong>${correctAnswers + (isCorrect ? 1 : 0)}문제</strong>를 맞추셨습니다.</p>
        `,
        icon: 'success',
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: '퀴즈 리스트로 돌아가기',
        cancelButtonText: '틀린 문제 확인하기',
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/quiz');
        } else {
          showIncorrectModal();
        }
      });

      if (!isCorrect) setIncorrectWords((prev) => [...prev, currentWord]);
      return;
    }

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);

      if (user.Lv < 3) {
        let newExp = user.Exp + 10;
        let newLv = user.Lv;

        if (newExp >= 100) {
          newExp -= 100;
          newLv += 1;
        }

        if (newLv > 3) {
          newExp = 0;
          newLv = 3;
        }

        await supabase
          .from('users')
          .update({ Exp: newExp, Lv: newLv })
          .eq('id', user.id);

        setUser({ ...user, Exp: newExp, Lv: newLv });
      }
    } else {
      setIncorrectWords((prev) => [...prev, currentWord]);
    }

    setSelectedAnswer(null);
    setCurrentWordIndex((prevIndex) => {
      const totalWords = post?.words.length || 0;
      const nextIndex = (prevIndex + 1) % totalWords;
      const nextWord = post?.words[nextIndex];
      if (nextWord) setRandomOptions(post.words, nextWord, allWords);
      return nextIndex;
    });
    setIsAnswered(false);
  };

  const showIncorrectModal = (words = incorrectWords) => {
    Swal.fire({
      title: '틀린 문제 확인',
      html: `
        <div style="text-align: left;">
          ${words.map((word, index) => `<p>${index + 1}. 의미: ${word.meaning}</p>`).join('')}
        </div>
      `,
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonText: '뒤로가기',
      cancelButtonText: '학습페이지로 이동하기',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: '퀴즈 완료!',
          html: `
            <p>현재 레벨: <strong>${user?.Lv}</strong></p>
            <p>현재 경험치: <strong>${user?.Exp}/100</strong></p>
            <p>${post?.words.length}문제 중 <strong>${correctAnswers}</strong>문제를 맞추셨습니다.</p>
          `,
          icon: 'success',
          allowOutsideClick: false,
          confirmButtonText: '퀴즈 리스트로 돌아가기',
        }).then(() => router.push('/quiz'));
      } else {
        router.push('/learning');
      }
    });
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
          <h1 className="absolute top-8 text-5xl font-bold text-center text-white">
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

      <div className="flex flex-grow items-center justify-center w-full p-12 mt-12">
        {!loading && !error && post && (
          <div className="relative w-[900px] h-[650px] bg-[#2E3856] p-8 rounded-lg shadow-lg text-white flex flex-col justify-between">
            <div className="quiz-description mb-6 text-center">
              <p className="text-4xl mt-16">{currentWord?.meaning}</p>
            </div>

            <div className="options-container grid grid-cols-2 gap-10 mt-4 mb-20">
              {currentOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectAnswer(option)}
                  className={`option text-white border p-4 rounded-lg shadow text-center font-bold cursor-pointer ${selectedAnswer
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

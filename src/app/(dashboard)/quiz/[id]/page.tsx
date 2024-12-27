'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { Tables } from '../../../../../database.types';
import { supabase } from '@/supabase/supabaseClient';

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
  const [quizResults, setQuizResults] = useState<Array<{ word: string; meaning: string; current: boolean }>>([]);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          setError('로그인이 필요합니다.');
          return;
        }

        const userId = session.user.id;
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, Exp, Lv')
          .eq('id', userId)
          .single();

        if (userError) throw userError;
        setUser(userData);

        const [allWordsResponse, postResponse] = await Promise.all([
          supabase.from('posts').select('words'),
          supabase.from('posts').select('id, title, words, description').eq('id', id).single(),
        ]);

        if (allWordsResponse.error) throw allWordsResponse.error;
        if (postResponse.error) throw postResponse.error;

        const mergedWords = allWordsResponse.data
          ?.map((post) => post.words)
          .flat() as Word[];

        setAllWords(mergedWords);

        const post = postResponse.data as Post;
        setPost(post);

        if (mergedWords && post.words.length > 0) {
          setRandomOptions(post.words, post.words[0], mergedWords);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const setRandomOptions = (postWords: Word[], currentWord: Word, allWords: Word[]) => {
    const validWords = allWords.filter((word) => word && word.word && word.meaning);
    const otherWords = validWords.filter((word) => word.word !== currentWord.word);
    const shuffledWords = [...otherWords].sort(() => 0.5 - Math.random());
    const options = [currentWord, ...shuffledWords.slice(0, 3)].sort(() => 0.5 - Math.random());
    setCurrentOptions(options);
  };

  const saveQuizHistory = async () => {
    if (!user || !post) return;

    const { error } = await supabase.from('quiz_history').insert({
      user_id: user.id,
      post_id: post.id,
      results: quizResults,
    });

    if (error) {
      console.error('퀴즈 기록 저장 실패:', error);
    }
  };

  const handleNext = async () => {
    if (!user || !selectedAnswer || !currentWord) return;

    const isCorrect = selectedAnswer.word === currentWord.word;
    const isLastQuestion = currentWordIndex === (post?.words.length || 1) - 1;

    setQuizResults((prev) => [
      ...prev,
      { word: currentWord.word, meaning: currentWord.meaning, current: isCorrect },
    ]);

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);

      let newExp = user.Exp + 5;
      let newLv = user.Lv;

      if (newExp >= 100) {
        newExp -= 100;
        newLv += 1;
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({ Exp: newExp, Lv: newLv })
        .eq('id', user.id);

      if (updateError) {
        console.error('경험치 업데이트 실패:', updateError);
        return;
      }

      setUser({ ...user, Exp: newExp, Lv: newLv });
    }

    if (isLastQuestion) {
      await saveQuizHistory();

      Swal.fire({
        title: '퀴즈 완료!',
        html: `
          <p>현재 레벨: <strong>${user.Lv}</strong></p>
          <p>현재 경험치: <strong>${user.Exp}/100</strong></p>
          <p>${post?.words.length}문제 중 <strong>${correctAnswers + (isCorrect ? 1 : 0)}문제</strong>를 맞추셨습니다.</p>
        `,
        icon: 'success',
        confirmButtonText: '퀴즈 리스트로 돌아가기',
      }).then(() => {
        router.push('/quiz');
      });
      return;
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

  const handleSkip = async () => {
    const isLastQuestion = currentWordIndex === (post?.words.length || 1) - 1;

    setQuizResults((prev) => [
      ...prev,
      { word: currentWord.word, meaning: currentWord.meaning, current: false },
    ]);

    if (isLastQuestion) {
      await saveQuizHistory();

      Swal.fire({
        title: '퀴즈 완료!',
        html: `
          <p>현재 레벨: <strong>${user?.Lv}</strong></p>
          <p>현재 경험치: <strong>${user?.Exp}/100</strong></p>
          <p>${post?.words.length}문제 중 <strong>${correctAnswers}</strong>문제를 맞추셨습니다.</p>
        `,
        icon: 'success',
        confirmButtonText: '퀴즈 리스트로 돌아가기',
      }).then(() => {
        router.push('/quiz');
      });
      return;
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
                  className={`option text-white border p-4 rounded-lg shadow text-center font-bold cursor-pointer ${
                    selectedAnswer
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
              onClick={handleSkip}
              className="absolute bottom-4 right-28 px-6 py-3 text-white border border-white rounded-lg hover:text-gray-200"
            >
              건너뛰기
            </button>

            <button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className={`absolute bottom-4 right-4 px-6 py-3 text-white border border-white rounded-lg hover:text-gray-200 ${
                !selectedAnswer ? 'opacity-50 cursor-not-allowed' : ''
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

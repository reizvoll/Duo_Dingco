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

type User = {
  id: string;
  Exp: number;
  Lv: number;
};

type QuizResult = {
  word: string;
  meaning: string;
  current: boolean;
};

const QuizPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentOptions, setCurrentOptions] = useState<Word[]>([]);
  const [allWords, setAllWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<Word | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

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
          supabase
            .from('posts')
            .select('id, title, words, description')
            .eq('id', id)
            .single(),
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
      } catch (err) {
        console.error('데이터를 가져오는 중 오류:', err);
        setError('데이터를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const setRandomOptions = (
    postWords: Word[],
    currentWord: Word,
    allWords: Word[]
  ) => {
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
    if (!user || !selectedAnswer || !post) return;

    const currentWord = post.words[currentWordIndex];
    const isCorrect = selectedAnswer.word === currentWord.word;

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

    const isLastQuestion = currentWordIndex === post.words.length - 1;
    if (isLastQuestion) {
      await saveQuizHistory();
      Swal.fire({
        title: '퀴즈 완료!',
        html: `
          <p>현재 레벨: <strong>${user.Lv}</strong></p>
          <p>현재 경험치: <strong>${user.Exp}/100</strong></p>
          <p>${post.words.length}문제 중 <strong>${correctAnswers}</strong>문제를 맞추셨습니다.</p>
        `,
        icon: 'success',
        confirmButtonText: '퀴즈 리스트로 돌아가기',
      }).then(() => router.push('/quiz'));
      return;
    }

    setSelectedAnswer(null);
    setCurrentWordIndex((prevIndex) => prevIndex + 1);
    setIsAnswered(false);
  };

  const handleSelectAnswer = (option: Word) => {
    if (!isAnswered) {
      setSelectedAnswer(option);
      setIsAnswered(true);
    }
  };

  const handleSkip = async () => {
    if (!post || !user) return;

    const currentWord = post.words[currentWordIndex];
    setQuizResults((prev) => [
      ...prev,
      { word: currentWord.word, meaning: currentWord.meaning, current: false },
    ]);

    const isLastQuestion = currentWordIndex === post.words.length - 1;
    if (isLastQuestion) {
      await saveQuizHistory();
      Swal.fire({
        title: '퀴즈 완료!',
        html: `<p>${post.words.length}문제 중 <strong>${correctAnswers}</strong>문제를 맞추셨습니다.</p>`,
        icon: 'success',
        confirmButtonText: '퀴즈 리스트로 돌아가기',
      }).then(() => router.push('/quiz'));
      return;
    }

    setSelectedAnswer(null);
    setCurrentWordIndex((prevIndex) => prevIndex + 1);
    setIsAnswered(false);
  };

  const currentWord = post?.words[currentWordIndex];

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="quiz-page relative flex flex-col items-center min-h-screen">
      {post && (
        <>
          <h1 className="absolute top-8 text-5xl font-bold text-center text-white">{post.title}</h1>
          <div className="absolute top-28 w-[46%] flex items-center justify-between mb-12">
            <span className="text-white text-lg font-bold px-4 py-2 border border-white rounded-lg">0</span>
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
        {post && (
          <div className="relative w-[900px] h-[650px] bg-[#2E3856] p-8 rounded-lg shadow-lg text-white flex flex-col justify-between">
            <div className="quiz-description mb-6 text-center">
              <p className="text-4xl mt-16">{currentWord?.meaning}</p>
            </div>

            <div className="options-container grid grid-cols-2 gap-10 mt-4 mb-20">
              {currentOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectAnswer(option)}
                  className={`option text-white border ${
                    selectedAnswer
                      ? option.word === currentWord?.word
                        ? 'border-green-500'
                        : selectedAnswer.word === option.word
                        ? 'border-red-500'
                        : 'border-white'
                      : 'border-white'
                  } p-4 rounded-lg shadow text-center font-bold cursor-pointer`}
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

'use client';

import React, { useEffect, useState } from 'react';

type Word = {
  id: string;
  words: string;
  meaning: string;
}

type Post = {
  id: string;
  title: string;
  words: Word[];
  description: string;
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
  {
    id: '2',
    title: '타입 스크립트 단어 모음',
    description: '타입 스크립트의 기본 타입 선언 방법입니다.',
    words: [
      { id: '3', words: 'Interface', meaning: '타입 선언' },
      { id: '4', words: 'Type', meaning: '타입 선언 2' },
    ],
  },
];

const QuizPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setPosts(mockPosts);
  }, []);

  return (
    <div className="quiz-page">
      <div className="mx-auto mt-[200px] w-[900px] h-[550px] bg-[#2E3856] text-white p-6 rounded-lg shadow-lg">
        <div className="posts-list space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="post space-y-4">
              <h2 className="text-2xl font-semibold">{post.title}</h2>
              <p className="text-lg">{post.description}</p>
              <ul className="space-y-2">
                {post.words.map((word) => (
                  <li
                    key={word.id}
                    className="flex justify-between bg-gray-800 p-2 rounded-lg"
                  >
                    <span className="font-medium">{word.words}</span>
                    <span className="text-sm text-gray-300">
                      {word.meaning}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;

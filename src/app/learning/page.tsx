'use client'

type Word = {
  id: string
  words: string // 단어
  meaning: string // 단어의 뜻
}

type Post = {
  id: string
  title: string // 학습 리스트 제목
  words: Word[] // 단어 목록
  description: string // 설명
}

export default function LearnListPage() {
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
  ]

  return (
    <div className="min-h-screen bg-[#0A092D] text-white p-6">
      <h1 className="text-2xl font-bold mb-4">학습 리스트</h1>
      <div className="grid grid-cols-2 gap-4">
        {mockPosts.map((post) => (
          <div
            key={post.id}
            className="p-4 bg-[#2E3856] text-white rounded-lg shadow-md"
          >
            <h2 className="text-lg font-bold">{post.title}</h2>
            <p className="text-sm text-gray-300">{post.description}</p>
            <ul className="mt-2">
              {post.words.map((word) => (
                <li
                  key={word.id}
                  className="p-2 bg-[#282E3E] rounded mt-1 text-sm flex justify-between"
                >
                  <span>{word.words}</span>
                  <span className="text-gray-400">{word.meaning}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

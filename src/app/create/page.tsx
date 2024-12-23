'use client'

import { PostCard } from '../../types/PostCard'
import { useState } from 'react'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { supabase } from '../api/supabase'

export default function Post() {
  const [cards, setCards] = useState<PostCard[]>([
    { id: 1, word: '', meaning: '' },
  ])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleAddCard = () => {
    const newCard: PostCard = {
      id: cards.length + 1,
      word: '',
      meaning: '',
    }
    setCards([...cards, newCard])
  }

  const handleRemoveCard = (id: number) => {
    setCards(cards.filter((card) => card.id !== id))
  }

  const handleInputChange = (
    id: number,
    field: 'word' | 'meaning',
    value: string,
  ) => {
    setCards(
      cards.map((card) =>
        card.id === id ? { ...card, [field]: value } : card,
      ),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const words = cards.map((card) => ({
      word: card.word,
      meaning: card.meaning,
    }))

    try {
      const { data, error } = await supabase.from('posts').insert([
        {
          title,
          description,
          words,
        },
      ])

      if (error) {
        console.error('Error inserting data:', error)
      } else {
        console.log('Data inserted successfully:', data)
        setTitle('')
        setDescription('')
        setCards([{ id: 1, word: '', meaning: '' }])
      }
    } catch (err) {
      console.error('Unexpected error:', err)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-width-[1200px] min-h-screen flex items-center justify-center"
    >
      <div className="w-full max-w-3xl p-8 rounded-lg text-white ">
        <h1 className="text-2xl font-bold mb-8 text-start">카드 생성하기</h1>

        {/* 제목 부분 div */}
        <div className="mb-4">
          <label className="block text-lg font-bold mb-2">제목</label>
          <input
            type="text"
            placeholder="제목을 입력해주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 mb-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 설명 부분 div */}
        <div className="mb-4">
          <label className="block text-lg font-bold mb-2">설명</label>
          <input
            type="text"
            placeholder="내용을 입력해주세요."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 mb-6 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 카드 내용 div */}
        <div>
          <label className="block text-lg font-bold mb-2">카드 내용</label>
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-gray-700 p-4 rounded-lg mb-4 relative"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-bold">{card.id}</span>
                <button
                  onClick={() => handleRemoveCard(card.id)}
                  className="text-white hover:text-red-500"
                >
                  <RiDeleteBin6Line size={16} />
                </button>
              </div>

              {/* 단어와 뜻이 있는 div */}
              <div className="flex items-end min-h-full justify-between gap-4">
                <div className="flex-[0.40] border-b border-white mr-4">
                  <textarea
                    value={card.word}
                    onChange={(e) =>
                      handleInputChange(card.id, 'word', e.target.value)
                    }
                    className="w-full bg-transparent text-white focus:outline-none resize-none overflow-hidden"
                    rows={1}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement
                      target.style.height = '1.5rem'
                      target.style.height = `${target.scrollHeight}px`
                    }}
                  />
                </div>

                <div className="flex-[0.60] border-b border-white ml-4">
                  <textarea
                    value={card.meaning}
                    onChange={(e) =>
                      handleInputChange(card.id, 'meaning', e.target.value)
                    }
                    className="w-full bg-transparent text-white focus:outline-none resize-none overflow-hidden"
                    rows={1}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement
                      target.style.height = '1.5rem'
                      target.style.height = `${target.scrollHeight}px`
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-12 mt-2">
                <label className="flex-[0.40] text-left">단어</label>
                <label className="flex-[0.60] text-left">뜻</label>
              </div>
            </div>
          ))}
        </div>

        {/* 카드 추가하기 버튼 */}
        <div className="flex items-center justify-center">
          <button
            onClick={handleAddCard}
            className="w-[400px] bg-[#2E3856] hover:bg-blue-800 text-white font-bold p-3 rounded-full mt-4 mb-6"
          >
            카드 추가하기
          </button>
        </div>

        {/* 만들기 버튼 */}
        <div className="flex justify-end">
          <button
            type="submit"
            className={`w-[100px] p-2 font-bold rounded-xl border-2 `}
          >
            만들기
          </button>
        </div>
      </div>
    </form>
  )
}

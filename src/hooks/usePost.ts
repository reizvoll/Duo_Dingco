import { useEffect, useState } from 'react'

import { supabase } from '@/app/api/supabase'
import { fetchUser, insertPost } from '@/app/api/posting'

import { PostCard } from '@/types/PostCard'

export function usePost() {
  const [cards, setCards] = useState<PostCard[]>([
    { id: 1, word: '', meaning: '' },
  ])
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const mockSignIn = async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: '123123@naver.com',
        password: '123123',
      })

      if (error) {
        console.error('Mock sign-in failed:', error.message)
      } else {
        setUserId(data.user?.id || null)
      }
    }

    mockSignIn()
  }, [])

  const handleAddCard = () => {
    const newCard = { id: cards.length + 1, word: '', meaning: '' }
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

    if (!userId) {
      console.error('User not authenticated.')
      return
    }

    const user = await fetchUser(userId)
    if (!user) {
      console.error('User validation failed.')
      return
    }

    const words = cards.map((card) => ({
      word: card.word,
      meaning: card.meaning,
    }))

    const result = await insertPost({
      title,
      description,
      words,
      userId: user.id,
    })

    if (result) {
      setTitle('')
      setDescription('')
      setCards([{ id: 1, word: '', meaning: '' }])
    }
  }

  const isFormCheck =
    title.trim() !== '' &&
    description.trim() !== '' &&
    cards.every((card) => card.word.trim() !== '' && card.meaning.trim() !== '')

  return {
    cards,
    title,
    description,
    setTitle,
    setDescription,
    handleAddCard,
    handleRemoveCard,
    handleInputChange,
    handleSubmit,
    isFormCheck,
  }
}

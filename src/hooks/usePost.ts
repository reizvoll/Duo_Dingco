import { useEffect, useState } from 'react'
import { supabase } from '@/supabase/supabase'
import { fetchUser, insertPost } from '@/app/api/post/posting'
import { PostCard } from '@/types/PostCard'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export function usePost() {
  const router = useRouter()
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

  const handleRemoveCard = (cardId: number) => {
    if (cards.length === 1) {
      return
    }

    const updatedCards = cards.filter((card) => card.id !== cardId)
    const reorderedCards = updatedCards.map((card, index) => ({
      ...card,
      id: index + 1,
    }))

    setCards(reorderedCards)
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

      Swal.fire({
        icon: 'success',
        title: '등록이 완료되었습니다!',
        showConfirmButton: false,
        timer: 2000,
      })

      setTimeout(() => {
        router.push('/')
      }, 2000)
    }
  }

  const isFormCheck =
    title.trim() !== '' &&
    description.trim() !== '' &&
    cards.every(
      (card) => card.word.trim() !== '' && card.meaning.trim() !== '',
    ) &&
    cards.length >= 4

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

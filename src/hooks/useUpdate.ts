import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import { updatePost } from '@/app/api/updating'
import { PostCard } from '@/types/PostCard'

export function useUpdate() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [cards, setCards] = useState<PostCard[]>([
    { id: 1, word: '', meaning: '' },
  ])
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  const initializeFields = (post: any) => {
    setTitle(post.title)
    setDescription(post.description)
    setCards(post.words || [])
  }

  const handleAddCard = () => {
    const newCard = { id: cards.length + 1, word: '', meaning: '' }
    setCards([...cards, newCard])
  }

  const handleRemoveCard = (cardId: number) => {
    setCards(cards.filter((card) => card.id !== cardId))
  }

  const handleInputChange = (
    cardId: number,
    field: 'word' | 'meaning',
    value: string,
  ) => {
    setCards(
      cards.map((card) =>
        card.id === cardId ? { ...card, [field]: value } : card,
      ),
    )
  }

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const words = cards.map((card) => ({
      word: card.word,
      meaning: card.meaning,
    }))

    const result = await updatePost({
      id,
      title,
      description,
      words,
    })

    if (result) {
      console.log('Post updated successfully')
      router.push('/') // 수정 후 메인 페이지로 이동
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
    handleUpdateSubmit,
    isFormCheck,
    initializeFields,
  }
}

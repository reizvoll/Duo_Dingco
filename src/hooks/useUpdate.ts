import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import { updatePost } from '@/app/api/post/updating'
import { PostCard } from '@/types/PostCard'
import Swal from 'sweetalert2'

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

  const handleUpdateSubmit = async (id: string) => {
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

      Swal.fire({
        icon: 'success',
        title: '수정이 완료되었습니다!',
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
    isFormCheck,
    setTitle,
    setDescription,
    handleAddCard,
    handleRemoveCard,
    handleInputChange,
    handleUpdateSubmit,
    initializeFields,
  }
}

import { useEffect, useState } from 'react'
import { insertPost } from '@/app/api/post/posting'
import { PostCard } from '@/types/PostCard'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/store/auth'

export function usePost() {
  const router = useRouter()
  const [cards, setCards] = useState<PostCard[]>([
    { id: 1, word: '', meaning: '' },
  ])
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  // 유저 정보를 가져오는 로직 zustand
  const user = useAuthStore((state) => state.user)
  useEffect(() => {
    if (!user) {
      console.error('User not authenticated.')
    }
  }, [user])

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

    console.log(user)

    if (!user) {
      Swal.fire({
        icon: 'error',
        title: '로그인이 필요합니다.',
        showConfirmButton: true,
      })
      return
    }

    if (cards.length < 4) {
      Swal.fire({
        icon: 'warning',
        title: '카드는 최소 4개 이상이어야 수정 가능합니다.',
        showConfirmButton: true,
      })
      return
    }

    if (
      !cards.every(
        (card) => card.word.trim() !== '' && card.meaning.trim() !== '',
      )
    ) {
      Swal.fire({
        icon: 'warning',
        title: '카드 내용을 모두 입력해주세요.',
        showConfirmButton: true,
      })
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
  }
}

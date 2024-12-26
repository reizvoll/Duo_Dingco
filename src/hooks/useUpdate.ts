import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import { updatePost } from '@/app/api/post/updating'
import { PostCard } from '@/types/PostCard'
import Swal from 'sweetalert2'
import { deletePostById } from '@/app/api/post/deleting'

export function useUpdate() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [cards, setCards] = useState<PostCard[]>([])
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

    const result = await updatePost({
      id,
      title,
      description,
      words,
    })

    if (result) {
      Swal.fire({
        icon: 'success',
        title: '수정이 완료되었습니다!',
        showConfirmButton: false,
        timer: 1000,
      })

      setTimeout(() => {
        router.push('/')
        router.refresh()
      }, 1000)
    }
  }

  const handleDeletePost = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: '정말 삭제하시겠습니까?',
        text: '삭제하면 데이터를 복구할 수 없습니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: '예, 삭제합니다!',
        cancelButtonText: '취소',
      })

      if (result.isConfirmed) {
        await deletePostById(id)
        await Swal.fire(
          '삭제 완료',
          '게시글이 성공적으로 삭제되었습니다.',
          'success',
        )
        router.push('/')
      }
    } catch (error) {
      console.error(error)
      await Swal.fire('삭제 실패', '게시글 삭제에 실패했습니다.', 'error')
    }

    return {
      handleDeletePost,
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
    handleDeletePost,
    handleInputChange,
    handleUpdateSubmit,
    initializeFields,
  }
}

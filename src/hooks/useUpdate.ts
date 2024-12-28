import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { updatePost } from '@/app/api/post/updating'
import { deletePostById } from '@/app/api/post/deleting'

import { PostCard } from '@/types/PostCard'

import Swal from 'sweetalert2'

export function useUpdate() {
  const router = useRouter()
  const queryclient = useQueryClient()

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

  const { mutate: handleUpdateSubmit } = useMutation({
    mutationFn: async (id: string) => {
      if (cards.length < 4) {
        throw new Error('카드는 최소 4개 이상이어야 수정 가능합니다.')
      }

      const words = cards.map((card) => ({
        word: card.word,
        meaning: card.meaning,
      }))

      return updatePost({ id, title, description, words })
    },
    onSuccess: () => {
      Swal.fire('수정 완료', '수정이 완료되었습니다!', 'success')
      router.push('/')
    },
    onError: (error) => {
      Swal.fire('수정 실패', error.message, 'error')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return deletePostById(id)
    },
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: '삭제 완료',
        text: '게시글이 성공적으로 삭제되었습니다.',
        confirmButtonText: '확인',
      }).then(() => {
        queryclient.invalidateQueries({ queryKey: ['posts'] })
        router.push('/')
      })
    },
    onError: () => {
      Swal.fire({
        icon: 'error',
        title: '삭제 실패',
        text: '게시글 삭제에 실패했습니다.',
        confirmButtonText: '확인',
      })
    },
  })

  const handleDeletePost = async (id: string) => {
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
      deleteMutation.mutate(id)
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

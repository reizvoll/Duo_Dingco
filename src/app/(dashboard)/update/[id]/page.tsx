'use client'

import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter, useParams } from 'next/navigation'

import { fetchPostId } from '@/app/api/post/updating'

import UpdateForm from '@/components/posting/PostUpdateForm'

import Swal from 'sweetalert2'

export default function UpdatePage() {
  const params = useParams()
  const router = useRouter()
  const postId = params?.id as string

  const {
    data: post,
    isPending,
    isError,
    isFetched,
  } = useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      if (!postId) {
        throw new Error('Post ID is missing')
      }
      const fetchedPost = await fetchPostId(postId)
      if (!fetchedPost) {
        throw new Error('Post not found')
      }
      return fetchedPost
    },
  })

  useEffect(() => {
    if (isFetched && (isError || !post)) {
      Swal.fire({
        icon: 'error',
        title: '유효하지 않은 ID입니다.',
        text: '홈으로 이동합니다.',
        confirmButtonText: '확인',
      }).then(() => {
        router.push('/')
      })
    }
  }, [isError, post, router])

  if (isPending) {
    return <div>Loading...</div>
  }

  return <UpdateForm post={post} />
}

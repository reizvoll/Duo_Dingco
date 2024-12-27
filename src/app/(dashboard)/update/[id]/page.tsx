'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { fetchPostId } from '@/app/api/post/updating'
import UpdateForm from '@/components/posting/PostUpdateForm'

export default function UpdatePage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postId = params?.id as string
        if (!postId) {
          console.error('Post ID is missing')
          router.push('/')
          return
        }

        const fetchedPost = await fetchPostId(postId)
        if (!fetchedPost) {
          console.error('Post not found')
          router.push('/')
          return
        }

        setPost(fetchedPost)
      } catch (error) {
        console.error('Error fetching post:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params?.id, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!post) {
    return <div>Post not found.</div>
  }

  return <UpdateForm post={post} />
}

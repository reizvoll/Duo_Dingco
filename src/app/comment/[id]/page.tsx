'use client'

import CardInfo from '@/components/comment/CardInfo'

import { useParams } from 'next/navigation'

export default function CommentPage() {
  const params = useParams()
  const postId = params?.id as string
  const userId = 'user-id'

  if (!postId) {
    return <div>잘못된 접근입니다. 게시글 ID가 없습니다.</div>
  }

  //   const handleCommentSubmit = (comment: string) => {
  //     console.log('댓글 작성:', comment)
  //   }

  return (
    <div className="px-4 py-8 max-w-[1200px] mx-auto">
      <CardInfo postId={postId} userId={userId} />
      {/* <CommentForm onCommentSubmit={handleCommentSubmit} /> */}
    </div>
  )
}

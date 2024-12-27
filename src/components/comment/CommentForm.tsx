'use client'

import { useState } from 'react'

interface CommentFormProps {
  onCommentSubmit: (comment: string) => void
}

export default function CommentForm({ onCommentSubmit }: CommentFormProps) {
  const [comment, setComment] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.trim()) {
      onCommentSubmit(comment)
      setComment('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white resize-none"
        rows={4}
        placeholder="댓글을 입력하세요."
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold"
      >
        작성하기
      </button>
    </form>
  )
}

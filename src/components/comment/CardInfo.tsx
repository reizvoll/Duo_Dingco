'use client'

import {
  fetchBookmarkStatus,
  fetchProfile,
  toggleBookmark,
} from '@/app/api/comment/fetchDataComment'
import { fetchPostId } from '@/app/api/post/updating'

import { Post } from '@/types/commentTypes'
import { User } from '@/types/user'

import { useEffect, useState } from 'react'
import { RiStarFill, RiStarLine } from 'react-icons/ri'

interface cardInfoProps {
  postId: string
  userId: string
}

export default function CardInfo({ postId, userId }: cardInfoProps) {
  const [post, setPost] = useState<Post | null>(null)
  const [profile, setProfile] = useState<User | null>(null)
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      const postIdData = await fetchPostId(postId)
      const profileData = postIdData
        ? await fetchProfile(postIdData.user_id)
        : null
      const bookmarkStatus = await fetchBookmarkStatus(postId, userId)

      setPost(postIdData)
      setProfile(profileData)
      setIsBookmarked(Boolean(bookmarkStatus))
    }

    fetchData()
  }, [postId, userId])

  const handleBookmarkToggle = async () => {
    await toggleBookmark(postId, userId, isBookmarked)
    setIsBookmarked(!isBookmarked)
  }

  if (!post || !profile) {
    return <div>Loading...</div>
  }

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg mb-8">
      <h1 className="text-3xl font-bold mb-8">카드 정보</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="w-[500px] h-[350px]">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{post.title}</h2>
            <button onClick={handleBookmarkToggle} className="text-yellow-400">
              {isBookmarked ? (
                <RiStarFill size={24} />
              ) : (
                <RiStarLine size={24} />
              )}
            </button>
          </div>
          <p className="text-white mb-4">{post.description}</p>
          <div className="flex items-center gap-2">
            <img
              src={profile.img_url}
              alt={profile.nickname}
              className="w-10 h-10 rounded-full"
            />
            <span>{profile.nickname}</span>
          </div>
          <div className="text-gray-500 text-sm ">
            등록일: {new Date(post.created_at).toLocaleDateString()}
          </div>
        </div>

        <div className="w-[500px] h-[350px] flex items-center flex-col justify-center bg-gray-900 rounded-lg">
          <div className="w-72 h-60 bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="bg-gray-800 text-white text-lg font-bold py-2 px-6 rounded-lg">
              {post.words.length}단어
            </div>
          </div>
          <button
            type="button"
            className={
              'w-[100px] p-2 font-bold rounded-xl border-2 mt-6 text-white'
            }
          >
            학습하기
          </button>
        </div>
      </div>
    </div>
  )
}

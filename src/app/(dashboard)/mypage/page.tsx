'use client'

import BookmarkedCardList from '@/components/mypage/BookmarkedCardList'
import MyPageCards from '@/components/mypage/CreateCardList'
import MyPageProfile from '@/components/mypage/MyPageProfile'

export default function MyPage() {
  return (
    <div className="max-w-custom mx-auto p-10 mt-[40px]">
      {/* 프로필 섹션 */}
      <MyPageProfile />
      <MyPageCards />
      <BookmarkedCardList />
    </div>
  )
}

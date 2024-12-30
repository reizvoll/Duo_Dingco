'use client'

import MyPageModal from './MyPageModal'
import { ProfileImage } from './ProfileLogic'

import Image from 'next/image'

import { useAuthStore } from '@/store/auth'
import { useModalStore } from '@/store/useModalStore'

import useFetchUser from '@/hooks/useFetchUser'

export default function MyPageProfile() {
  const { user } = useAuthStore()
  const { loading } = useFetchUser()
  const { openModal } = useModalStore()

  if (loading) return <p className="text-center text-white">로딩 중...</p>

  const level = user?.Lv ?? 1

  return (
    <div className="max-w-custom mx-auto p-8">
      {/* 프로필 섹션 */}
      <div className="flex items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          {/* 프로필 이미지 */}
          <div className="relative w-20 h-20 flex-shrink-0 -translate-y-2">
            <Image
              src={user?.img_url || '/dingco.png'}
              alt="Profile Image"
              layout="fill"
              className="rounded-full border-2 object-cover"
            />
          </div>

          {/* 유저 정보 */}
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-bold text-white translate-y-4">
              {user?.nickname || '유저'}
            </h1>

            <div className="flex items-center">
              {/* 레벨 및 레벨 이미지 */}
              <div className="text-xl flex items-center">Lv. {level}</div>
              <div className="ml-1 flex items-center">
                <ProfileImage level={level} />
              </div>

              {/* 경험치 */}
              <div className="text-lg text-gray-400 ml-4">
                Exp: {user?.Exp ?? 0}
              </div>
            </div>
          </div>
        </div>

        {/* 프로필 수정 버튼 */}
        <button
          onClick={openModal}
          className="px-10 py-2 border-2 rounded-full hover:bg-gray-700 hover:scale-105 transition duration-300"
        >
          수정하기
        </button>
      </div>

      <MyPageModal />
    </div>
  )
}

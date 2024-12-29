'use client';

import { useAuthStore } from '@/store/auth';
import useFetchUser from '@/hooks/useFetchUser';
import Image from 'next/image';
import { ProfileImage } from './ProfileLogic';
import { useModalStore } from '@/store/useModalStore';
import MyPageModal from './MyPageModal'; 

export default function MyPageProfile() {
  const { user } = useAuthStore();
  const { loading } = useFetchUser();
  const { openModal } = useModalStore();

  if (loading) return <p className="text-center text-white">로딩 중...</p>;

  const level = user?.Lv ?? 1;
  
  return (
    <div className="max-w-custom mx-auto p-8">
      {/* 프로필 섹션 */}
      <div className="flex items-center mb-12 gap-16">
        <div className="flex items-center gap-8">
          {/* 프로필 이미지 */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <Image
              src={user?.img_url || '/dingco.png'}
              alt="Profile Image"
              layout="fill"
              className="rounded-full border object-cover"
            />
          </div>

          {/* 유저 정보 */}
          <div className="flex justify-center items-center gap-4">
            <h1 className="text-3xl font-bold text-white">{user?.nickname || '유저'}</h1>

            {/* 레벨 및 레벨 이미지 */}
            <div className="flex items-center space-x-1 mt-2">
              <div className="text-xl text-gray-400 flex items-center">
                Lv. {level}
              </div>
              <div className="ml-1 flex items-center">
                <ProfileImage level={level} />
              </div>
            </div>

            {/* 경험치 */}
            <div className="text-md text-gray-400">
              Exp: {user?.Exp ?? 0}
            </div>
          </div>
        </div>

        {/* 프로필 수정 버튼 */}
        <button
          onClick={openModal}
          className="px-6 py-3 border rounded-lg text-white hover:bg-gray-700 flex-shrink-0 ml-12"
        >
          수정하기
        </button>
      </div>

      <MyPageModal />
    </div>
  );
}
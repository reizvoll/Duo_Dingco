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
    <div className="max-w-5xl mx-auto p-8">
      {/* 프로필 섹션 */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center space-x-6">
          <div className="relative w-24 h-24">
            <Image
              src={user?.img_url || '/dingco.png'}
              alt="Profile Image"
              layout="fill"
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{user?.nickname || '유저'}</h1>

            {/* 레벨 / 이미지 섹션 */}
            <div className="flex items-center space-x-2 mt-2">
              <p className="text-xl text-gray-400 flex items-center">
                Lv. {level}
                <span className="ml-2">
                  <ProfileImage level={level} />
                </span>
              </p>
            </div>

            <p className="text-md text-gray-400">Exp: {user?.Exp ?? 0}</p>
          </div>
        </div>

        {/* 프로필 수정 버튼 */}
        <button
          onClick={openModal}
          className="px-4 py-2 border rounded-lg text-white hover:bg-gray-700"
        >
          수정하기
        </button>
      </div>

      <MyPageModal />
    </div>
  );
}
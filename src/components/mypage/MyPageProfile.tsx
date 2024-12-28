'use client';

import { useAuthStore } from '@/store/auth';
import useFetchUser from '@/hooks/useFetchUser';
import Image from 'next/image';

export default function MyPageProfile() {
  const { user } = useAuthStore();
  const { loading } = useFetchUser(); // 유저 정보 로딩

  if (loading) return <p className="text-center text-white">로딩 중...</p>;

  return (
    <div className="max-w-5xl mx-auto p-8">
      {/* 프로필 섹션 */}
      <div className="flex items-center space-x-6 mb-12">
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
          <p className="text-xl text-gray-400">Lv. {user?.Lv ?? 1}</p>
          <p className="text-md text-gray-400">Exp: {user?.Exp ?? 0}</p>
        </div>
      </div>
    </div>
  );
}
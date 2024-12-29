'use client';

import { IoClose } from 'react-icons/io5';
import Image from 'next/image';
import { handleLogout } from '@/components/auth/LogoutHandler';
import { useAuthStore } from '@/store/auth';
import { useModalStore } from '@/store/useModalStore';
import useFetchUser from '@/hooks/useFetchUser';

export default function MyPageModal() {
  const { isModalOpen, closeModal } = useModalStore();
  const { user, clearUser } = useAuthStore();
  const { loading } = useFetchUser();

  if (loading) return null;
  if (!isModalOpen || !user) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white p-8 rounded-lg w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          onClick={closeModal}
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6">마이페이지</h2>

        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto">
            <Image
              src={user.img_url || '/dingco.png'}
              alt="Profile"
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
          </div>
          <p className="mt-4 text-sm text-gray-500">닉네임: {user.nickname}</p>
          <p className="text-sm text-gray-500">Lv. {user.Lv ?? '알 수 없음'}</p>
          <p className="text-sm text-gray-500">Exp. {user.Exp ?? 0}</p>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            className="bg-red-500 text-white px-6 py-2 rounded"
            onClick={async () => {
              await handleLogout();
              clearUser();
              closeModal();
            }}
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
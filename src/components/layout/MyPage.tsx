'use client';

import { useState } from 'react';
import { useModalStore } from '@/store/useModalStore';
import { IoClose } from 'react-icons/io5';
import Image from 'next/image';
import { handleLogout } from '@/components/auth/LogoutHandler';

const MyPageModal = () => {
  const { user } = useModalStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (!user) return null;

  return (
    <>
      {isModalOpen && (
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

            <h2 className="text-2xl font-semibold text-center mb-6">
              마이페이지
            </h2>

            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto">
                <Image
                  src={user.img_url || '/default-profile.png'}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
              </div>
              <p className="mt-4">ID: {user.id}</p>
              <p className="text-sm text-gray-500">Lv. {user.Lv ?? '알 수 없음'}</p>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                className="bg-red-500 text-white px-6 py-2 rounded"
                onClick={async () => {
                  await handleLogout();
                  closeModal();
                }}
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyPageModal;
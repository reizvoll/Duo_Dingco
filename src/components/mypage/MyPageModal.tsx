'use client';

import { IoClose } from 'react-icons/io5';
import { handleLogout } from '@/components/auth/LogoutHandler';
import { useModalStore } from '@/store/useModalStore';
import useFetchUser from '@/hooks/useFetchUser';
import useProfileHandlers from '@/hooks/useProfileHandler';
import { useAuthStore } from '@/store/auth';
import ProfileImageUpload from './ProfileImageUpload';
import NicknameInput from './NicknameInput';

export default function MyPageModal() {
  const { isModalOpen, closeModal } = useModalStore();
  const { clearUser } = useAuthStore();
  const { loading } = useFetchUser();
  const { handleNicknameChange } = useProfileHandlers();

  if (loading) return null;
  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={closeModal}
    >
      <div
        className="bg-[#2E3856] p-6 rounded-lg w-[90%] sm:w-[400px] h-[90%] sm:h-[500px] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={closeModal}
        >
          <IoClose className="w-6 h-6" />
        </button>

        {/* 타이틀 */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mt-6 sm:mt-10">
          Mypage
        </h2>

        {/* 프로필 이미지 업로드 */}
        <div className="flex flex-col items-center mt-6 sm:mt-10">
          <ProfileImageUpload />
        </div>

        {/* 닉네임 수정 입력 */}
        <div className="mt-6 sm:mt-8 w-[90%] sm:w-[320px] mx-auto">
          <NicknameInput />
        </div>

        {/* 버튼 그룹 */}
        <div className="flex justify-center gap-3 mt-10 sm:mt-12">
          {/* 수정 버튼 */}
          <button
            className="bg-[#282E3E] text-white w-[45%] sm:w-[130px] h-[40px] sm:h-[40px] rounded-md hover:bg-opacity-80"
            onClick={handleNicknameChange}
          >
            수정하기
          </button>

          {/* 로그아웃 버튼 */}
          <button
            className="bg-[#8A343C] text-white w-[45%] sm:w-[130px] h-[40px] sm:h-[40px] rounded-md hover:bg-opacity-80"
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
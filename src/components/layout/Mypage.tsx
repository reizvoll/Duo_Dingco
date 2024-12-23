"use client";
import React from "react";
import ReactDOM from "react-dom";
import Image from "next/image";
import { useModalStore } from "@/store/useModalStore";

interface MyPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const MyPage: React.FC<MyPageProps> = ({ isOpen, onClose }) => {
  const { user } = useModalStore();

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[400px]">
        <h2 className="text-xl font-semibold mb-4">마이페이지</h2>
        {user ? (
          <>
            <div className="flex flex-col items-center">
              <Image
                src={user.img_url || "/default-profile.png"}
                alt="프로필 이미지"
                width={96}
                height={96}
                className="rounded-full"
                priority
              />
              <p className="text-lg mt-2">{user.nickname}</p>
            </div>
            <button
              onClick={onClose}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              닫기
            </button>
          </>
        ) : (
          <p>로그인이 필요합니다.</p>
        )}
      </div>
    </div>,
    document.getElementById("portal-root")!
  );
};

export default MyPage;
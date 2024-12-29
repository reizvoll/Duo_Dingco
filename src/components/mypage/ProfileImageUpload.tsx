'use client'

import useProfileHandlers from '@/hooks/useProfileHandler';
import Image from 'next/image';
import { useRef } from 'react';

export default function ProfileImageUpload() {
  const { previewImage, handleImageUpload, uploading } = useProfileHandlers();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // p 태그 클릭 시 input 클릭 트리거
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center">
      {/* 프로필 이미지 */}
      <div className="relative w-24 h-24 mx-auto">
        <Image
          src={previewImage}
          alt="Profile"
          width={96}
          height={96}
          className="rounded-full border-2 object-cover"
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageUpload}
          disabled={uploading}
        />
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
            <p className="text-sm">업로드 중...</p>
          </div>
        )}
      </div>

      {/* 프로필 이미지 텍스트 (클릭 가능) */}
      <p
        className=" text-sm mt-5 underline cursor-pointer"
        onClick={triggerFileInput}
      >
        프로필 이미지
      </p>
    </div>
  );
}
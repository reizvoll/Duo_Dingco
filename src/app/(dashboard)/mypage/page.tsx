'use client';

import MyPageProfile from '@/components/mypage/MyPageProfile';

export default function MyPage() {
  return (
      <div className="max-w-custom mx-auto p-8">
        {/* 프로필 섹션 */}
        <MyPageProfile />
      </div>
  );
}
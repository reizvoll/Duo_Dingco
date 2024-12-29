'use client';

import MyPageProfile from '@/components/mypage/MyPageProfile';
import { useAuthStore } from '@/store/auth';

export default function MyPage() {
  const { user } = useAuthStore();

  return (
      <div className="max-w-6xl mx-auto p-8">
        {/* 프로필 섹션 */}
        <MyPageProfile />
      </div>
  );
}
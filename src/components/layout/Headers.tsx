import dynamic from 'next/dynamic';
import HeadNav from './HeadNav';

// Mypage 클라이언트 컴포넌트 동적 임포트
const Mypage = dynamic(() => import('./MyPage'), { ssr: false });

export default function Headers() {
  return (
    <>
      <HeadNav />
      
      {/* 모달 (클라이언트에서만 렌더링) */}
      <Mypage />
    </>
  );
}
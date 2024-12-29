import Image from 'next/image';
import useFetchUser from '@/hooks/useFetchUser';
import { useAuthStore } from '@/store/auth';
import { AuthState } from '@/store/auth';  // AuthState 타입 사용

// 최대 레벨 설정
const MAX_LEVEL = 3;

// 레벨 별 필요 경험치
const levelExp = {
  1: 100,
  2: 200,
  3: 0,
};

// 프로필 이미지 매핑
const profileImages = {
  1: '/dingco.png',
  2: '/dingdingco.png',
  3: '/dingdingdingco.png',
};

// 타입 정의 (level to props)
type ProfileImageProps = {
    level: number;
  };

// 경험치 및 레벨 업데이트 함수
export const updateUserExpAndLevel = async (
    user: AuthState['user'],
    setUser: (user: AuthState['user']) => void
  ) => {
    if (!user) return;
  
    const expGained = 5;
    const newExp = (user.Exp ?? 0) + expGained;
  
    // user.Lv = 1 | 2 | 3 중 하나
    const nextLevelExp = levelExp[user.Lv as keyof typeof levelExp] || 0;
    const hasLeveledUp = newExp >= nextLevelExp && (user.Lv ?? 1) < MAX_LEVEL;
  
    const updatedUser = {
      ...user,
      Exp: hasLeveledUp ? newExp - nextLevelExp : newExp,
      Lv: hasLeveledUp ? Math.min((user.Lv ?? 1) + 1, MAX_LEVEL) : user.Lv ?? 1,
    };
  
    setUser(updatedUser);
    console.log('레벨 및 경험치 업데이트:', updatedUser);
  
    await fetch('/api/updateUser', {
      method: 'POST',
      body: JSON.stringify(updatedUser),
    });
  };
  
  export const ProfileImage = ({ level }: ProfileImageProps) => {
    // level = 1 | 2 | 3 중 하나
    const profileSrc = profileImages[level as keyof typeof profileImages] || profileImages[1];
  
    return (
      <div className="relative w-24 h-24">
        <Image
          src={profileSrc}
          alt={`Lv ${level} 프로필`}
          width={96}
          height={96}
          className="rounded-full object-cover"
          priority
        />
      </div>
    );
  };
  

export const ProfileImageWithFetch = () => {
    const { user } = useAuthStore();
    const { loading } = useFetchUser();
  
    if (loading) {
      return (
        <div className="relative w-24 h-24">
          <Image
            src="/images/loading.png"
            alt="로딩 중..."
            width={96}
            height={96}
            className="rounded-full object-cover"
          />
        </div>
      );
    }
  
    const level = user?.Lv ?? 1;
  
    return (
      <div className="relative w-24 h-24">
        <ProfileImage level={level} />  {/* 레벨을 props로 전달 */}
      </div>
    );
  };
import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/supabase/supabaseClient';

export default function useProfileHandlers() {
  const { user, setUser } = useAuthStore();
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [previewImage, setPreviewImage] = useState(user?.img_url || '/dingco.png');
  const [uploading, setUploading] = useState(false);

  // 닉네임 중복 확인 및 업데이트
  const handleNicknameChange = async () => {
    if (nickname.trim() === '') {
      alert('닉네임을 입력해주세요.');
      return;
    }

    if (user) {
      // 1. 닉네임 중복 확인
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('nickname', nickname)
        .maybeSingle();

      if (checkError) {
        console.error('닉네임 확인 중 오류 발생:', checkError);
        alert('서버 오류가 발생했습니다. 다시 시도해주세요.');
        return;
      }

      if (existingUser && existingUser.id !== user.id) {
        alert('이미 존재하는 닉네임입니다. 다른 닉네임을 선택해주세요.');
        return;
      }

      // 2. 닉네임 업데이트
      const { error: updateError } = await supabase
        .from('users')
        .update({ nickname })
        .eq('id', user.id);

      if (updateError) {
        alert('닉네임 업데이트 실패');
        console.error('닉네임 업데이트 실패:', updateError.message);
      } else {
        setUser({ ...user, nickname });
        alert('닉네임이 성공적으로 변경되었습니다!');
      }
    }
  };

  // 프로필 이미지 업로드 및 업데이트 (얜 작동잘됨 건들 ㄴㄴ)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      
      setUploading(true);
      const filePath = `public/${user.id}/profile.jpg`;

      // 이미지 업로드
      const { error: uploadError } = await supabase
        .storage
        .from('profiles')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        alert('이미지 업로드 실패');
        console.error('이미지 업로드 실패:', uploadError.message);
        setUploading(false);
        return;
      }

      // 업로드된 이미지 URL 가져오기
      const { data } = supabase
        .storage
        .from('profiles')
        .getPublicUrl(filePath);

      if (!data || !data.publicUrl) {
        alert('이미지 URL을 불러오는 데 실패했습니다.');
        setUploading(false);
        return;
      }

      const imageUrl = data.publicUrl;

      // DB 업데이트
      const { error: updateError } = await supabase
        .from('users')
        .update({ img_url: imageUrl })
        .eq('id', user.id);

      if (updateError) {
        alert('프로필 이미지 업데이트 실패');
      } else {
        setUser({ ...user, img_url: imageUrl });
        setPreviewImage(imageUrl);
        alert('프로필 이미지가 성공적으로 업데이트되었습니다.');
      }
      setUploading(false);
    }
  };

  return {
    nickname,
    setNickname,
    previewImage,
    handleImageUpload,
    handleNicknameChange,
    uploading,
  };
}
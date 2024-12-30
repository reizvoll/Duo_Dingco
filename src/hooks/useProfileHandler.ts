import { useState } from 'react'
import Swal from 'sweetalert2'

import { supabase } from '@/supabase/supabaseClient'

import { useAuthStore } from '@/store/auth'

export default function useProfileHandlers() {
  const { user, setUser } = useAuthStore()
  const [previewImage, setPreviewImage] = useState(
    user?.img_url || '/dingco.png',
  )
  const [uploading, setUploading] = useState(false)

  // 닉네임 중복 확인 및 업데이트
  const handleNicknameChange = async (nickname: string) => {
    if (nickname.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: '닉네임을 입력해주세요.',
        confirmButtonText: '확인',
      })
      return
    }

    if (user) {
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('nickname')
        .eq('nickname', nickname)
        .maybeSingle()

      if (checkError) {
        Swal.fire({
          icon: 'error',
          title: '서버 오류',
          text: '서버 오류가 발생했습니다. 다시 시도해주세요.',
          confirmButtonText: '확인',
        })
        return
      }

      if (existingUser && existingUser.nickname !== user.nickname) {
        Swal.fire({
          icon: 'warning',
          title: '중복된 닉네임',
          text: '이미 존재하는 닉네임입니다. 다른 닉네임을 선택해주세요.',
          confirmButtonText: '확인',
        })
        return
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({ nickname: nickname })
        .eq('id', user.id)

      if (updateError) {
        Swal.fire({
          icon: 'error',
          title: '업데이트 실패',
          text: '닉네임 업데이트에 실패했습니다.',
          confirmButtonText: '확인',
        })
      } else {
        setUser({ ...user, nickname })
        Swal.fire({
          icon: 'success',
          title: '닉네임 변경 완료',
          text: '닉네임이 성공적으로 변경되었습니다!',
          confirmButtonText: '확인',
        })
      }
    }
  }

  // 프로필 이미지 업로드 및 업데이트
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && user) {
      setUploading(true)
      const filePath = `public/${user.id}/profile.jpg`

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        Swal.fire({
          icon: 'error',
          title: '이미지 업로드 실패',
          text: '이미지 업로드에 실패했습니다.',
          confirmButtonText: '확인',
        })
        setUploading(false)
        return
      }

      const { data } = supabase.storage.from('profiles').getPublicUrl(filePath)

      if (!data || !data.publicUrl) {
        Swal.fire({
          icon: 'error',
          title: 'URL 불러오기 실패',
          text: '이미지 URL을 불러오는 데 실패했습니다.',
          confirmButtonText: '확인',
        })
        setUploading(false)
        return
      }

      const imageUrl = data.publicUrl

      const { error: updateError } = await supabase
        .from('users')
        .update({ img_url: imageUrl })
        .eq('id', user.id)

      if (updateError) {
        Swal.fire({
          icon: 'error',
          title: '업데이트 실패',
          text: '프로필 이미지 업데이트에 실패했습니다.',
          confirmButtonText: '확인',
        })
      } else {
        setUser({ ...user, img_url: imageUrl })
        setPreviewImage(imageUrl)
        Swal.fire({
          icon: 'success',
          title: '프로필 업데이트 완료',
          text: '프로필 이미지가 성공적으로 업데이트되었습니다.',
          confirmButtonText: '확인',
        })
      }
      setUploading(false)
    }
  }

  return {
    previewImage,
    handleImageUpload,
    handleNicknameChange,
    uploading,
  }
}

'use client'

import { supabase } from '@/supabase/supabaseClient'
import { useAuthStore } from '@/store/auth'
import Swal from 'sweetalert2'

export const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut() // Supabase 세션 제거
    if (error) {
      throw new Error(error.message)
    }

    const clearUser = useAuthStore.getState().clearUser // Zustand 상태 초기화 (로그아웃)
    clearUser()

    await Swal.fire({
      icon: 'success',
      title: '로그아웃 완료',
      text: '정상적으로 로그아웃되었습니다.',
      showCancelButton: true,
    })
    window.location.href = '/' // 로그아웃 후 메인 페이지로 리다이렉트
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: '로그아웃 실패',
      text: error.message || '알 수 없는 오류가 발생했습니다.',
    })
  }
}
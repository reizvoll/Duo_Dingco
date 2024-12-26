'use server'

import { createClient } from '@/supabase/supabaseServer'

export async function handleSignUp(
  formData: FormData,
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const nickname = formData.get('nickname') as string
  const profileImage = formData.get('profileImage') as File | null

  if (password !== confirmPassword) {
    return { success: false, message: '비밀번호가 일치하지 않습니다.' }
  }

  if (
    password.length < 6 ||
    !/[a-z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    return {
      success: false,
      message:
        '비밀번호가 유효하지 않습니다.6자리 이상의 영문,숫자가 포함된 비밀번호를 입력해주세요.',
    }
  }

  try {
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      return { success: false, message: error.message }
    }

    if (profileImage) {
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(`public/${email}/profile.jpg`, profileImage, { upsert: true })

      if (uploadError) {
        return {
          success: false,
          message: '프로필 이미지 업로드에 실패했습니다.',
        }
      }
    }

    return { success: true, message: '회원가입이 성공적으로 완료되었습니다!' }
  } catch (error) {
    return { success: false, message: '회원가입 중 오류가 발생했습니다.' }
  }
}

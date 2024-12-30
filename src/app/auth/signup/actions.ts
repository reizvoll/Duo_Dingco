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
        '비밀번호는 6자 이상이어야 하며, 영문 소문자와 숫자가 포함되어야 합니다.',
    }
  }

  try {
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('nickname', nickname)
      .maybeSingle()

    if (checkError) throw new Error('닉네임 확인 중 오류 발생')
    if (existingUser) {
      return {
        success: false,
        message: '이미 존재하는 닉네임입니다. 다른 닉네임을 사용해주세요.',
      }
    }

    let publicUrl: string | null = null

    if (profileImage && profileImage.size > 0) {
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(`public/${nickname}/profile.jpg`, profileImage, {
          upsert: true,
        })

      if (uploadError) throw new Error('프로필 이미지 업로드 실패')
      const { data: uploadedData } = supabase.storage
        .from('profiles')
        .getPublicUrl(`public/${nickname}/profile.jpg`)
      publicUrl = uploadedData?.publicUrl || null
    }

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: nickname, avatar_url: publicUrl } },
    })

    if (authError) throw new Error(authError.message)

    return { success: true, message: '회원가입이 성공적으로 완료되었습니다!' }
  } catch (error) {
    console.error(error)
    return { success: false, message: '회원가입 중 오류가 발생했습니다.' }
  }
}

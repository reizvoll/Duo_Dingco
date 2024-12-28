'use server'
import { createClient } from '@/supabase/supabaseServer'

export async function handleSignUp(
  formData: FormData,
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient()

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const nickname = formData.get('nickname') as string
  const profileImage = formData.get('profileImage') as File | null
  const email = formData.get('email') as string

  // 비밀번호 검증
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
        '비밀번호가 유효하지 않습니다. 6자리 이상의 영문, 숫자가 포함된 비밀번호를 입력해주세요.',
    }
  }

  try {
    // 닉네임 중복 확인
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('nickname', nickname)
      .maybeSingle()

    if (existingUser) {
      return {
        success: false,
        message: '이미 존재하는 닉네임입니다. 다른 닉네임을 선택해주세요.',
      }
    }

    if (checkError) {
      console.error('닉네임 확인 중 오류 발생:', checkError)
      return { success: false, message: '닉네임 확인 중 오류가 발생했습니다.' }
    }

    // 프로필 이미지 업로드
    let publicUrl = null

    if (profileImage && profileImage.size > 0) {
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(`public/${nickname}/profile.jpg`, profileImage, {
          upsert: true,
        })

      if (uploadError) {
        console.error('프로필 이미지 업로드 실패:', uploadError)
        return {
          success: false,
          message: '프로필 이미지 업로드에 실패했습니다.',
        }
      }

      const { data: uploadedData } = supabase.storage
        .from('profiles')
        .getPublicUrl(`public/${nickname}/profile.jpg`)

      publicUrl = uploadedData?.publicUrl || null
    }
    console.log('raw_user_meta_data:', {
      avatar_url: publicUrl || null, // 이 값이 null인지 확인
    })

    // Supabase Auth 회원가입
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: nickname,
        },
      },
    })

    if (authError) {
      console.error('회원가입 중 인증 오류:', authError)
      return { success: false, message: authError.message }
    }

    return { success: true, message: '회원가입이 성공적으로 완료되었습니다!' }
  } catch (error) {
    console.error('회원가입 중 알 수 없는 오류:', error)
    return { success: false, message: '회원가입 중 오류가 발생했습니다.' }
  }
}

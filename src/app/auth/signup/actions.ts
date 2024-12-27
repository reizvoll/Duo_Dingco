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
    // 닉네임 중복 확인
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('nickname', nickname)
      .single()

    if (checkError) {
      console.error('Check Error:', checkError)
    }

    if (existingUser) {
      return {
        success: false,
        message: '이미 존재하는 닉네임입니다. 다른 닉네임을 선택해주세요.',
      }
    }

    // Supabase Auth 회원가입
    const { data: userdata, error: authError } = await supabase.auth.signUp({
      email: `${nickname}@example.com`,
      password,
    })

    if (authError) {
      return { success: false, message: authError.message }
    }
    console.log(userdata)

    let publicUrl = null
    if (profileImage) {
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(`public/${nickname}/profile.jpg`, profileImage, {
          upsert: true,
        })

      if (uploadError) {
        return {
          success: false,
          message: '프로필 이미지 업로드에 실패했습니다.',
        }
      }

      const { data } = supabase.storage
        .from('profiles')
        .getPublicUrl(`public/${nickname}/profile.jpg`)

      publicUrl = data?.publicUrl || null
    }

    // Public users 테이블에 데이터 삽입
    const { error: insertError } = await supabase
      .from('users') // Public users 테이블
      .insert([
        {
          id: userdata?.user?.id,
          nickname,
          img_url: publicUrl || null, // 생성된 프로필 이미지 URL 저장
          Exp: 0,
          Lv: 1,
        },
      ])

    if (insertError) {
      console.error('Insert Error:', insertError)
      return {
        success: false,
        message: '사용자 데이터를 저장하는데 실패했습니다.',
      }
    }

    return { success: true, message: '회원가입이 성공적으로 완료되었습니다!' }
  } catch (error) {
    console.error('회원가입 오류:', error)
    return { success: false, message: '회원가입 중 오류가 발생했습니다.' }
  }
}

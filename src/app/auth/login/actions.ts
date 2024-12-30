'use server'

import { createClient } from '@/supabase/supabaseServer'

export async function handleLogin(
  formData: FormData,
): Promise<{ success: boolean; message: string }> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { success: false, message: '이메일과 비밀번호를 입력해주세요.' }
  }

  const supabase = await createClient()
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (loginError) {
    return { success: false, message: '이메일 또는 비밀번호가 잘못되었습니다.' }
  }

  return { success: true, message: '로그인 성공' }
}

export async function handleGoogleLogin(): Promise<{
  success: boolean
  url?: string
  message?: string
}> {
  try {
    const supabase = await createClient()
    const { data, error: googleError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://duo-dingco-beta.vercel.app/' },
    })

    if (googleError) {
      return { success: false, message: googleError.message }
    }

    if (data.url) {
      return { success: true, url: data.url }
    } else {
      return { success: false, message: 'Google 리디렉션 URL이 없습니다.' }
    }
  } catch (err: any) {
    console.error('Google 로그인 중 오류 발생:', err.message)
    return {
      success: false,
      message: err.message || '알 수 없는 오류가 발생했습니다.',
    }
  }
}

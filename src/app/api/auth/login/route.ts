import { createClient } from '@/supabase/supabaseServer'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json(
      { success: false, message: '이메일과 비밀번호를 입력해주세요.' },
      { status: 400 },
    )
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return NextResponse.json(
      { success: false, message: '이메일 또는 비밀번호가 잘못되었습니다.' },
      { status: 401 },
    )
    console.log(error)
  }

  return NextResponse.json({ success: true, message: '로그인 성공!' })
}

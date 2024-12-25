import { NextResponse } from 'next/server'
import { supabase } from '../../../supabase/supabase'

export async function POST(request: Request) {
  const { email, password, nickname, img_url } = await request.json()

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (data.user) {
      // 기본 이미지 설정
      const profileImage = img_url || '/dingco.png'

      // 추가 사용자 정보를 public.users 테이블에 저장
      const { error: userError } = await supabase.from('users').insert([
        {
          id: data.user.id,
          created_at: new Date().toISOString(),
          nickname: nickname || '',
          img_url: profileImage,
          Exp: 0,
          Lv: 1,
        },
      ])

      if (userError) {
        return NextResponse.json(
          { error: '사용자 정보 저장 실패: ' + userError.message },
          { status: 400 },
        )
      }
    }

    return NextResponse.json({ user: data.user }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: '알 수 없는 오류가 발생했습니다.' },
      { status: 500 },
    )
  }
}

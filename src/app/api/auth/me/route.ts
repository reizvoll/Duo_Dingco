import { NextResponse } from 'next/server'
import { createClient } from '@/supabase/supabaseServer'

export async function GET() {
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.getUser()

  if (authError || !authData.user) {
    return NextResponse.json({ success: false, user: null }, { status: 401 })
  }

  const userId = authData.user.id
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (userError) {
    console.error('유저정보 어디감?:', userError.message)
    return NextResponse.json({ success: false, user: null }, { status: 500 })
  }

  return NextResponse.json({ success: true, user: userData })
}
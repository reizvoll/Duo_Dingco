import { NextResponse } from 'next/server'
import { createClient } from '@/supabase/supabaseServer'

export async function GET() {
  const supabase = await createClient()
  const { data: session } = await supabase.auth.getSession()

  if (!session?.session) {
    return NextResponse.json({ success: false, user: null }, { status: 401 })
  }

  const { data: user } = await supabase.auth.getUser()

  return NextResponse.json({ success: true, user })
}

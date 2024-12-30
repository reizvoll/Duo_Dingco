import { useState, useEffect } from 'react'

import { supabase } from '@/supabase/supabaseClient'

import { useAuthStore } from '@/store/auth'
import { useModalStore } from '@/store/useModalStore'

// 유저 데이터를 불러오는 커스텀 훅 생성.. (안만들면 또 노가다 해야할거같아서 만듬 ㅠ)
export default function useFetchUser() {
  const { setUser, clearUser } = useAuthStore()
  const { closeModal } = useModalStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession()

      if (sessionError || !sessionData.session) {
        clearUser()
        closeModal()
        setLoading(false)
        return
      }

      const supabaseUser = sessionData.session.user
      const userId = supabaseUser.id

      // users 테이블에서 Lv, Exp 가져오기
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('nickname, Lv, Exp, img_url')
        .eq('id', userId)
        .single()

      if (userError || !userData) {
        closeModal()
        setLoading(false)
        return
      }

      const newUser = {
        id: userId,
        email: supabaseUser.email || '',
        nickname: userData.nickname || 'guest',
        img_url: userData.img_url || '/dingco.png',
        Exp: userData.Exp || 0,
        Lv: userData.Lv || 1,
      }

      setUser(newUser)
      setLoading(false)
    }

    fetchUserData()
  }, [setUser, clearUser, closeModal])

  return { loading }
}

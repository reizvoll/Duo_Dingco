import { useState, useEffect } from 'react'
import { supabase } from '@/supabase/supabaseClient'
import { User } from '@/types/user'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true) //뺴고
  const [error, setError] = useState<string | null>(null) //빼고

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      try {
        const { data: session } = await supabase.auth.getSession()

        if (!session || !session.session) {
          setUser(null)
          setLoading(false)
          return
        }

        const currentUser = session.session.user

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, nickname, img_url, created_at, Exp, Lv')
          .eq('id', currentUser.id)
          .maybeSingle() // 수정: single() -> maybeSingle() [임시방편]

        if (userError) {
          console.error('User fetch error:', userError.message)
          setError(userError.message)
        }

        if (userData) {
          setUser(userData)
        } else {
          console.warn('No user data found for this user ID.')
          setUser(null)
        }
      } catch (err) {
        console.error('Unexpected error:', err)
        setError('Unexpected error occurred.')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          fetchUser()
        } else {
          setUser(null)
        }
      },
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return { user, loading, error }
}

import { supabase } from '@/supabase/supabaseClient'
import { User } from '@/types/user'

export const fetchProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, nickname, img_url')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching author:', error.message)
    return null
  }
  return data as User
}
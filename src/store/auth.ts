import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type AuthState = {
  user: {
    id: string
    email: string
    nickname: string
    img_url?: string
    Exp?: number
    Lv?: number
  } | null
  setUser: (user: AuthState['user']) => void
  clearUser: () => void
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    { name: 'DuoDing-Co', storage: createJSONStorage(() => sessionStorage) },
  ),
)

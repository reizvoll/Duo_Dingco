'use client'

import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation'

// 여기 부탁함 케이리.. 음 디자인은.. ye... 피그마보고 하셔..
// (정작 대장은 따끈-한 카드 냅다 가져와벌임 ^-^...)

export default function MyPageCards() {
  const user = useAuthStore((state) => state.user)
  const router = useRouter()
}

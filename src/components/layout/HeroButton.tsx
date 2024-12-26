'use client'

import { useAuthStore } from '@/store/auth'
import Link from 'next/link'

export default function HeroButton() {
  const user = useAuthStore((state) => state.user)

  return user ? (
    <Link href="/dashboard">
      <button className="mt-6 px-16 py-2 border-2 border-gray-400 text-md rounded-2xl hover:bg-gray-100 hover:text-[#13132D] hover:border-transparent font-medium transition">
        학습하러 가기
      </button>
    </Link>
  ) : (
    <Link href="/login">
      <button className="mt-6 px-16 py-2 border-2 border-gray-400 text-md rounded-2xl hover:bg-gray-100 hover:text-[#13132D] hover:border-transparent font-medium transition">
        로그인 하기
      </button>
    </Link>
  )
}
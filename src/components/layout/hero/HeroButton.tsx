'use client'

import { useAuthStore } from '@/store/auth'
import Link from 'next/link'

export default function HeroButton() {
  const user = useAuthStore((state) => state.user)

  return user ? (
    <Link href="/learning">
      <button className="mt-6 px-8 py-1 text-sm border-2 border-gray-400 rounded-xl hover:bg-gray-100 hover:text-[#13132D] hover:border-transparent font-medium transition md:px-16 md:py-2 md:text-md md:rounded-2xl">
        시작하기
      </button>
    </Link>
  ) : (
    <Link href="/auth/signup">
      <button className="mt-6 px-8 py-1 text-sm border-2 border-gray-400 rounded-xl hover:bg-gray-100 hover:text-[#13132D] hover:border-transparent font-medium transition md:px-16 md:py-2 md:text-md md:rounded-2xl">
        가입하기
      </button>
    </Link>
  )
}
'use client'

import { useUser } from '@/hooks/useUser'
import Link from 'next/link'

export default function HeroButton() {
  const user = useUser()

  return user ? (
    <Link href="/learning">
      <button className="mt-6 px-16 py-2 border-2 border-gray-400 text-md rounded-2xl hover:bg-gray-100 hover:text-[#13132D] hover:border-transparent font-medium transition">
        시작하기
      </button>
    </Link>
  ) : (
    <Link href="/auth/signup">
      <button className="mt-6 px-16 py-2 border-2 border-gray-400 text-md rounded-2xl hover:bg-gray-100 hover:text-[#13132D] hover:border-transparent font-medium transition">
        가입하기
      </button>
    </Link>
  )
}

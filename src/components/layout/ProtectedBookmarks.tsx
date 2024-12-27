'use client'

import Link from 'next/link'
import { MdOutlineBookmarks } from 'react-icons/md'
import { handleLoginRedirect } from './ProtectedLogin'
import { useAuthStore } from '@/store/auth'

export default function ProtectedBookmarks() {
  const user = useAuthStore((state) => state.user) // useUser 훅 사용

  const handleProtectedLink = (e: React.MouseEvent) => {
    if (!user?.id) {
      e.preventDefault()
      handleLoginRedirect()
    }
  }

  return (
    <Link
      href={user?.id ? '/mypage' : '#'}
      passHref
      onClick={handleProtectedLink}
    >
      <MdOutlineBookmarks className="text-white w-[25px] h-[25px] cursor-pointer" />
    </Link>
  )
}

'use client'

import Link from 'next/link'
import { MdOutlineBookmarks } from 'react-icons/md'
import { handleLoginRedirect } from './ProtectedLogin'
import { useUser } from '@/hooks/useUser'  // useUser 훅 import

export default function ProtectedBookmarks() {
  const { user } = useUser()  // useUser 훅 사용

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
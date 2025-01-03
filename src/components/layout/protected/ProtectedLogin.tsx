'use client'

import Swal from 'sweetalert2'

import Image from 'next/image'

import { FiLogIn, FiLogOut } from 'react-icons/fi'

import { useModalStore } from '@/store/useModalStore'
import { useAuthStore } from '@/store/auth'

type ProtectedLoginProps = {
  onLogout?: () => Promise<void> // 로그아웃 함수 Prop (?를 줘서 선택적 기능으로 변경)
}

export const handleLoginRedirect = () => {
  Swal.fire({
    title: `로그인이 필요합니다`,
    text: `로그인 하시겠습니까?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: '예',
    cancelButtonText: '아니오',
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = '/auth/login'
    }
  })
}

const ProtectedLogin = ({ onLogout }: ProtectedLoginProps) => {
  const { openModal } = useModalStore()
  const user = useAuthStore((state) => state.user)

  const handleProfileClick = () => {
    if (user?.id) {
      openModal()
    } else {
      handleLoginRedirect()
    }
  }

  return (
    <>
      {user?.id ? (
        <>
          <FiLogOut
            className="text-white w-[25px] h-[25px] cursor-pointer"
            onClick={onLogout} //로그아웃 동작 연결
          />
          <div
            className="w-[38px] h-[38px] rounded-full bg-gray-400 cursor-pointer flex items-center justify-center"
            onClick={handleProfileClick}
          >
            <Image
              src={user.img_url || '/dingco.png'}
              alt="profile"
              width={43}
              height={43}
              className="rounded-full object-cover"
              priority
            />
          </div>
        </>
      ) : (
        <>
          <FiLogIn
            className="text-white w-[25px] h-[25px]"
            onClick={handleLoginRedirect}
          />
          <div
            className="w-[38px] h-[38px] rounded-full bg-gray-500 flex items-center justify-center cursor-pointer"
            onClick={handleProfileClick}
          ></div>
        </>
      )}
    </>
  )
}

export default ProtectedLogin

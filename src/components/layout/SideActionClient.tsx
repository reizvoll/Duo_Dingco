'use client'

import Image from 'next/image'
import { FiLogIn, FiLogOut } from 'react-icons/fi'
import { useModalStore } from '@/store/useModalStore'
import Swal from 'sweetalert2'

const ClientSideActions = ({ user }: { user: any }) => {
  const { openModal, logout } = useModalStore()

  const handleLoginRedirect = () => {
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
            onClick={logout}
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

export default ClientSideActions
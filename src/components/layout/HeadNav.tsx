'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FiLogIn, FiLogOut } from 'react-icons/fi'
import { useModalStore } from '@/store/useModalStore'
import Swal from 'sweetalert2'
import MyPage from './Mypage'
import { GoHome } from 'react-icons/go'
import { MdOutlineBookmarks } from 'react-icons/md'

const HeadNav = () => {
  const { user, isModalOpen, openModal, closeModal, logout } = useModalStore()

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
        window.location.href = '/auth/signin'
      }
    })
  }

  const handleAuthAction = (callback: () => void) => (e?: React.MouseEvent) => {
    if (user?.id) {
      callback()
    } else {
      e?.preventDefault()
      handleLoginRedirect()
    }
  }

  const handleProfileClick = handleAuthAction(openModal)
  const handleBookmarkClick = handleAuthAction(() => {})

  return (
    <div className="absolute top-5 right-5 w-[242px] h-[50px] bg-[rgba(137,137,137,0.4)] backdrop-blur-[2px] rounded-[30px] flex items-center justify-around px-5 z-30">
      {/* 홈 아이콘 */}
      <Link href="/" passHref>
        <GoHome className="text-white w-[30px] h-[30px] cursor-pointer" />
      </Link>

      {/* 북마크 아이콘 */}
      <Link href="/mypage" passHref onClick={handleBookmarkClick}>
        <MdOutlineBookmarks className="text-white w-[25px] h-[25px] cursor-pointer" />
      </Link>

      {user?.id ? (
        <>
          {/* 로그아웃 아이콘 */}
          <FiLogOut
            className="text-white w-[25px] h-[25px] cursor-pointer"
            onClick={logout}
          />

          {/* 프로필 이미지 */}
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
          {/* 로그인 아이콘 */}
          <FiLogIn
            className="text-white w-[25px] h-[25px]"
            onClick={handleLoginRedirect}
          />

          {/* 기본 회색 프로필 이미지 */}
          <div
            className="w-[38px] h-[38px] rounded-full bg-gray-500 flex items-center justify-center cursor-pointer"
            onClick={handleProfileClick}
          ></div>
        </>
      )}

      {/* 마이페이지 모달 */}
      <MyPage isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
}

export default HeadNav

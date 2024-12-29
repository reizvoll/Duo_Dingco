'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { GoHome } from 'react-icons/go'
import { LuBookA } from 'react-icons/lu'
import { MdOutlinePostAdd, MdOutlineQuiz } from 'react-icons/md'
import { FaRegCircleUser } from 'react-icons/fa6'
import { PiListBold } from 'react-icons/pi'
import Image from 'next/image'
import { FaHotjar } from 'react-icons/fa'

interface SidebarProps {
  menuIsOpen: boolean
  toggleMenu: () => void
}

const MENU_ITEMS = [
  { path: '/', label: '홈', icon: <GoHome />, iconSize: 'text-4xl' },
  { path: '/learning', label: '학습하기', icon: <LuBookA />, iconSize: 'text-4xl' },
  { path: '/quiz', label: 'Quiz', icon: <MdOutlineQuiz />, iconSize: 'text-4xl' },
  { path: '/create', label: '문제 생성하기', icon: <MdOutlinePostAdd />, iconSize: 'text-4xl' },
  { path: '/hotlearning', label: '따끈-한 단어', icon: <FaHotjar />, iconSize: 'text-3xl' },  // FaHotjar만 크기 작게
]

export default function InsideSideNav({
  menuIsOpen,
  toggleMenu,
}: SidebarProps) {
  const pathname = usePathname()
  const [selectedMenu, setSelectedMenu] = useState<string>(pathname)
  const sidebarRef = useRef<HTMLDivElement | null>(null)

  // 현재 경로에 따른 선택된 메뉴의 상태 업데이트하기
  useEffect(() => {
    const path = pathname.split('/')[1]
    setSelectedMenu(path)
  }, [pathname])

  // 메뉴 외부 클릭하면, 사이드바 닫도록
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuIsOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        toggleMenu()
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [menuIsOpen])

  return (
    <section
      ref={sidebarRef}
      className={`
        fixed top-0 left-0 h-screen shadow-lg z-50
        flex flex-col justify-between
        transform transition-all duration-300 ease-in-out
        ${menuIsOpen ? 'w-[280px]' : 'w-[90px]'}
        h-[100vh] max-h-[100vh] min-h-[500px]
      `}
    >
      {/* 상단 아이콘과 로고 */}
      <div>
        <div className="flex items-center pt-6 pl-6">
          <button className="text-4xl text-gray-50" onClick={toggleMenu}>
            <PiListBold />
          </button>
          {menuIsOpen && (
            <Link href="/" passHref>
              <div className="ml-4 cursor-pointer">
                <Image
                  src="/duodingco_logo.png"
                  width={60}
                  height={60}
                  alt="듀오딩코 로고"
                />
              </div>
            </Link>
          )}
        </div>

        {/* 메뉴 리스트 */}
        <nav className="h-full flex flex-col justify-start items-start pt-28 gap-8 pl-4">
          {MENU_ITEMS.map((item) => {
            const isActive = selectedMenu === item.path.split('/')[1]
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={toggleMenu}
                className={`flex items-center rounded-lg ${isActive ? 'bg-[#4A4E69]' : 'hover:bg-[#2E3143]'
                  } ${menuIsOpen
                    ? 'w-[80%] p-3 gap-4'
                    : 'w-[60px] h-[60px] justify-center'
                  }`}
              >
                {/* 아이콘 크기 적용 부분 (iconSize로 분기 처리) */}
                <div
                  className={`${item.iconSize} ${isActive ? 'text-[#AFB7FF]' : 'text-[#E0E1DD]'}
                 flex items-center justify-center h-[40px]
                `}
                >
                  {item.icon}
                </div>
                {menuIsOpen && (
                  <span
                    className={`text-xl ${isActive ? 'text-[#B4CFFA]' : 'text-[#E0E1DD]'
                      }`}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* 하단 마이페이지 */}
      <div className="flex justify-start pl-4 mb-10">
        <Link
          href="/mypage"
          className={`flex items-center rounded-lg ${selectedMenu === 'mypage' ? 'bg-[#4A4E69]' : 'hover:bg-[#2E3143]'
            } ${menuIsOpen
              ? 'w-[80%] p-3 gap-4'
              : 'w-[60px] h-[60px] justify-center'
            }`}
        >
          <FaRegCircleUser
            className={`text-4xl ${selectedMenu === 'mypage' ? 'text-[#AFB7FF]' : 'text-[#E0E1DD]'
              }`}
          />
          {menuIsOpen && (
            <span
              className={`text-xl ${selectedMenu === 'mypage' ? 'text-[#B4CFFA]' : 'text-[#E0E1DD]'
                }`}
            >
              마이페이지
            </span>
          )}
        </Link>
      </div>
    </section>
  )
}
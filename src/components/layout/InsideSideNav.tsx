'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { GoHome } from 'react-icons/go'
import { LuBookA } from 'react-icons/lu'
import { MdOutlinePostAdd, MdOutlineQuiz } from 'react-icons/md'
import { FaRegCircleUser } from 'react-icons/fa6'

interface SidebarProps {
  menuIsOpen: boolean
  toggleMenu: () => void
}

// 메뉴 데이터
const MENU_ITEMS = [
  { path: '/', label: '홈', icon: <GoHome className="text-4xl" /> },
  { path: '/study', label: '학습하기', icon: <LuBookA className="text-4xl" /> },
  { path: '/quiz', label: 'Quiz', icon: <MdOutlineQuiz className="text-4xl" /> },
  {
    path: '/create',
    label: '문제 생성하기',
    icon: <MdOutlinePostAdd className="text-4xl" />,
  },
]

export default function InsideSideNav({ menuIsOpen, toggleMenu }: SidebarProps) {
  const pathname = usePathname()
  const [selectedMenu, setSelectedMenu] = useState<string>(pathname)
  const sidebarRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const path = pathname.split('/')[1]
    setSelectedMenu(path)
  }, [pathname])

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
          fixed top-0 left-0 h-screen w-[90px] bg-[#111322] shadow-lg z-50
          transform transition-transform duration-300 ease-in-out
          ${menuIsOpen ? 'w-[280px]' : 'w-[90px]'}
        `}
    >
      <button
        className="text-4xl absolute top-4 right-5 text-gray-50"
        onClick={toggleMenu}
      >
        &times;
      </button>

      {/* 메뉴 리스트 */}
      <nav className="h-full flex flex-col justify-start items-center pt-28 gap-10">
        {MENU_ITEMS.map((item) => {
          const isActive = selectedMenu === item.path.split('/')[1]
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={toggleMenu}
              className={`flex items-center gap-4 w-[80%] p-3 rounded-lg ${
                isActive ? 'bg-[#4A4E69]' : 'hover:bg-[#2E3143]'
              }`}
            >
              {item.icon}
              {menuIsOpen && (
                <span
                  className={`text-xl ${
                    isActive ? 'text-[#B4CFFA]' : 'text-[#E0E1DD]'
                  }`}
                >
                  {item.label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* 하단 마이페이지 */}
      <div className="absolute bottom-10 w-full flex justify-center">
        <Link
          href="/mypage"
          className={`flex items-center gap-4 w-[80%] p-3 rounded-lg ${
            selectedMenu === 'mypage' ? 'bg-[#4A4E69]' : 'hover:bg-[#2E3143]'
          }`}
        >
          <FaRegCircleUser className="text-4xl" />
          {menuIsOpen && (
            <span
              className={`text-xl ${
                selectedMenu === 'mypage' ? 'text-[#B4CFFA]' : 'text-[#E0E1DD]'
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
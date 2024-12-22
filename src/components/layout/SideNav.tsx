'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MdMenu } from 'react-icons/md'
import { useState } from 'react'
import InsideSideNav from './InsideSideNav'
import { PiListBold } from 'react-icons/pi'

export default function SideNav() {
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false)

  const toggleMenu = () => {
    setMenuIsOpen((prev) => !prev)
  }

  return (
    <header className="fixed top-0 left-0 w-[90px] h-screen bg-[#111322] shadow-lg z-50 flex flex-col items-center py-6">
      {/* 로고 */}
      <Link href="/" className="mb-20">
        <Image
          src="/duodingco_logo.png"
          width={50}
          height={50}
          alt=""
        />
      </Link>

      <button type="button" onClick={toggleMenu}>
        <PiListBold className="text-4xl text-gray-50" />
      </button>

      {/* Sidebar (메뉴 목록) */}
      <InsideSideNav menuIsOpen={menuIsOpen} toggleMenu={toggleMenu} />
    </header>
  )
}
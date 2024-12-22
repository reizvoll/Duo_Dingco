'use client'

import { useState } from 'react'
import InsideSideNav from './InsideSideNav'

export default function SideNav() {
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false)

  const toggleMenu = () => {
    setMenuIsOpen((prev) => !prev)
  }

  return (
    <header
      className={`fixed top-0 left-0 h-screen shadow-lg z-50 flex flex-col items-center py-6
        transform transition-all duration-300 ease-in-out
        ${menuIsOpen ? 'w-[280px]' : 'w-[90px]'}`}
    >

      {/* Sidebar (메뉴 목록) */}
      <InsideSideNav menuIsOpen={menuIsOpen} toggleMenu={toggleMenu} />
    </header>
  )
}
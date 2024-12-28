'use client'

import { useModalStore } from '@/store/useModalStore'
import dynamic from 'next/dynamic'

const MyPage = dynamic(() => import('./MyPage'), { ssr: false })

export default function ModalHandler() {
  const { isModalOpen, closeModal } = useModalStore()

  return <MyPage isOpen={isModalOpen} onClose={closeModal} />
}
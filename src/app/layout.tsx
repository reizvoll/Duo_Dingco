import type { Metadata } from 'next'
import HeadNav from '@/components/layout/HeadNav'
import SideNav from '@/components/layout/SideNav'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Duo-Dingco',
  description: '낱말카드로 코딩 관련 내용을 쉽게 배울 수 있도록 도와주는 학습 플랫폼',
  icons: {
    icon: '/dingco.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <HeadNav />
        <SideNav />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}

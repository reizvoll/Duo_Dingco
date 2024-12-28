import type { Metadata } from 'next'
import '@/styles/globals.css'
import QueryProvider from '@/components/providers/RqProvider'

export const metadata: Metadata = {
  title: 'Duo-Dingco',
  description:
    '낱말카드로 코딩 관련 내용을 쉽게 배울 수 있도록 도와주는 학습 플랫폼',
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
        <QueryProvider>
          <main className="flex-1">{children}</main>
        </QueryProvider>
      </body>
    </html>
  )
}

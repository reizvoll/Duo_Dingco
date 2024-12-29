import type { Metadata } from 'next'
import '@/styles/globals.css'
import QueryProvider from '@/components/providers/RqProvider'

export const metadata: Metadata = {
  title: 'Duo-Dingco',
  description:
    '낱말카드로 코딩 내용을 쉽게 학습할 수 있도록 도와주는 웹 어플리케이션',
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
import HeadNav from '@/components/layout/HeadNav'
import SideNav from '@/components/layout/SideNav'
import '@/styles/globals.css'
import { metadata } from '../layout';

export { metadata }

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
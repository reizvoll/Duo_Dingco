import HeadNav from '@/components/layout/HeadNav'
import SideNav from '@/components/layout/SideNav'
import '@/styles/globals.css'
import { getServerModalState } from '@/store/useModalStore'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const serverState = getServerModalState()

  return (
      <>
        <HeadNav user={serverState.user} />
        <SideNav />
        <main className="flex-1">{children}</main>
      </>
  )
}
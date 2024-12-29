import SideNav from '@/components/layout/navigation/SideNav'
import '@/styles/globals.css'
import Headers from '@/components/layout/Headers'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* 사이드바 */}
      <SideNav />
      
      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Headers />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}

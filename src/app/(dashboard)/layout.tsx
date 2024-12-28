import SideNav from '@/components/layout/navigation/SideNav'
import '@/styles/globals.css'
import Headers from '@/components/layout/Headers'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
      <>
        <Headers />
        <SideNav />
        <main className="flex-1">{children}</main>
      </>
  )
}
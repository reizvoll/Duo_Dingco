import ProtectedLogin from './protected/ProtectedLogin'
import { handleLogout } from '@/components/auth/LogoutHandler'

export default function Layout() {
  return (
    <div className="flex justify-end items-center p-4 bg-[#13132D]">
      <ProtectedLogin onLogout={handleLogout} />
    </div>
  )
}

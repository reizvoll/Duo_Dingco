import ProtectedLogin from '../layout/ProtectedLogin'
import { handleLogout } from '@/components/auth/logoutHandler'

export default function Layout() {
  return (
    <div className="flex justify-end items-center p-4 bg-[#13132D]">
      <ProtectedLogin onLogout={handleLogout} />
    </div>
  )
}

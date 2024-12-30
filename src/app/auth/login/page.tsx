import LoginForm from '@/components/auth/LoginForm'
import { handleLogin, handleGoogleLogin } from './actions'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#13132D]">
      <LoginForm action={handleLogin} onGoogleLogin={handleGoogleLogin} />
    </div>
  )
}
import SignUpForm from '@/components/auth/SignUpForm'
import { handleSignUp } from './actions'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#13132D]">
      <SignUpForm action={handleSignUp} />
    </div>
  )
}

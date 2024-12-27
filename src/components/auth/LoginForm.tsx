'use client'

import { useState } from 'react'
import Swal from 'sweetalert2'
import { IoIosArrowDropleft } from 'react-icons/io'
import Image from 'next/image'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation'

export default function LoginForm({
  action,
  onGoogleLogin,
}: {
  action: (formData: FormData) => Promise<{ success: boolean; message: string }>
  onGoogleLogin: () => Promise<{
    success: boolean
    url?: string
    message?: string
  }>
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const { setUser } = useAuthStore()
  const router = useRouter()

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me', { credentials: 'include' })
      if (response.ok) {
        const { user } = await response.json()
        setUser(user) // Zustand에 유저 정보 저장
      } else {
        console.error('Failed to fetch user data')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData()
    formData.set('email', email)
    formData.set('password', password)

    try {
      const result = await action(formData)

      if (!result.success) {
        Swal.fire({
          icon: 'error',
          title: '로그인 실패',
          text: result.message,
        })
      } else {
        await fetchUserData() // Zustand 업데이트
        Swal.fire({
          icon: 'success',
          title: '로그인 성공',
          text: result.message,
        })
        router.push('/')
      }
    } catch {
      Swal.fire({
        icon: 'error',
        title: '로그인 실패',
        text: '오류가 발생했습니다. 다시 시도해주세요.',
      })
    }
  }

  const handleGoogleAuth = async () => {
    const result = await onGoogleLogin()
    if (!result?.success) {
      Swal.fire({
        icon: 'error',
        title: 'Google 로그인 실패',
        text: result.message,
      })
    }
    router.push(result.url!)
  }

  return (
    <div className="relative w-full max-w-sm md:max-w-md bg-[#13132D] border border-white rounded-lg p-20">
      <button
        onClick={() => window.history.back()}
        className="absolute top-4 left-4 text-white text-xl"
      >
        <IoIosArrowDropleft size={30} />
      </button>

      <h2 className="text-3xl font-bold text-center mt-7 text-white mb-4">
        로그인
      </h2>
      <p className="text-center text-gray-400 mb-10">정보를 입력해주세요.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="email"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full py-3 px-4 border-none rounded-lg bg-[#1E1E30] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <div className="relative">
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full py-3 px-4 border-none rounded-lg bg-[#1E1E30] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-400"
            onClick={() => setIsPasswordVisible((prev) => !prev)}
          >
            {isPasswordVisible ? '숨기기' : '보이기'}
          </button>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            className="w-2/4 bg-[#1E1E30] py-3 text-white rounded-full hover:bg-[#282847] text-center"
          >
            로그인
          </button>
        </div>
      </form>

      <div className="flex items-center justify-center mt-6">
        <hr className="border-gray-500 w-1/4" />
        <span className="text-gray-400 mx-4">또는</span>
        <hr className="border-gray-500 w-1/4" />
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleGoogleAuth}
          className="flex items-center bg-white text-black px-5 py-3 rounded-full shadow hover:shadow-lg"
        >
          <Image
            src="/google-logo.png"
            alt="Google Logo"
            width={24}
            height={24}
            className="mr-3"
          />
          로그인 진행하기
        </button>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { IoIosArrowDropleft } from 'react-icons/io'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    if (!email || !password) {
      Swal.fire({
        icon: 'error',
        title: '로그인 실패',
        text: '이메일과 비밀번호를 입력해주세요.',
      })
      return
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        Swal.fire({
          icon: 'error',
          title: '로그인 실패',
          text: '이메일 또는 비밀번호가 잘못되었습니다.',
        })
      } else {
        Swal.fire({
          icon: 'success',
          title: '로그인 성공',
          text: '로그인에 성공했습니다!',
        })
        router.push('/')
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '오류',
        text: '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.',
      })
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      })

      if (error) {
        Swal.fire({
          icon: 'error',
          title: 'Google 로그인 실패',
          text: '소셜 로그인 중 오류가 발생했습니다. 다시 시도해주세요.',
        })
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '오류',
        text: '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.',
      })
    }
  }

  return (
    <div className="relative w-full max-w-sm md:max-w-md bg-[#13132D] border border-white rounded-lg p-20">
      <button
        onClick={() => router.push('/')}
        className="absolute top-4 left-4 text-white text-xl"
      >
        <IoIosArrowDropleft size={30} />
      </button>

      <h2 className="text-3xl font-bold text-center mt-7 text-white mb-4">
        로그인
      </h2>
      <p className="text-center text-gray-400 mb-10">정보를 입력해주세요.</p>

      <div className="space-y-6">
        <input
          type="email"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full py-3 px-4 border-none rounded-lg bg-[#1E1E30] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="relative">
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full py-3 px-4 border-none rounded-lg bg-[#1E1E30] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            className="absolute right-3 top-3 text-gray-400"
          >
            {isPasswordVisible ? '숨기기' : '보이기'}
          </button>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleLogin}
          className="w-2/4 bg-[#1E1E30] py-3 text-white rounded-full hover:bg-[#282847] text-center"
        >
          로그인
        </button>
      </div>

      <div className="flex items-center justify-center mt-6">
        <hr className="border-gray-500 w-1/4" />
        <span className="text-gray-400 mx-4">또는</span>
        <hr className="border-gray-500 w-1/4" />
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleGoogleLogin}
          className="flex items-center bg-white text-black px-5 py-3 rounded-full shadow hover:shadow-lg"
        >
          <Image
            src="/google-logo.png"
            alt="Google Logo"
            width={24}
            height={24}
            className="mr-3"
          />
          Google로 로그인 진행하기
        </button>
      </div>
    </div>
  )
}

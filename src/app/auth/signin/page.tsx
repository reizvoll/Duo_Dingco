'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { IoIosArrowDropleft } from 'react-icons/io'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export default function Login() {
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

  return (
    <div className="min-h-screen bg-[#13132D] flex items-center justify-center">
      <div className="relative w-full max-w-md bg-[#13132D] border border-white rounded-lg p-8">
        <button
          onClick={() => router.push('/')}
          className="absolute top-4 left-4 text-white text-xl"
        >
          <IoIosArrowDropleft size={30} />
        </button>

        <h2 className="text-2xl font-bold text-center mt-7 text-white mb-2">
          로그인
        </h2>
        <p className="text-center text-gray-400 mb-10">정보를 입력해주세요.</p>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="이메일 입력창"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border-none rounded-lg bg-[#1E1E30] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="relative">
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder="비밀번호 입력창"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border-none rounded-lg bg-[#1E1E30] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleLogin}
            className="w-2/4 bg-[#1E1E30] m-6 text-white p-3 rounded-full hover:bg-[#282847] text-center"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  )
}

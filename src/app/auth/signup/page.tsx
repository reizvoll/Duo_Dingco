'use client'

import { useState } from 'react'
import Swal from 'sweetalert2'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { IoIosArrowDropleft } from 'react-icons/io'
import { createClient } from '@supabase/supabase-js'

// Supabase 클라이언트 생성
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false)
  const [passwordError, setPasswordError] = useState(false)

  const router = useRouter() // Next.js 라우터 사용을 위한 초기화

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    const isValid =
      value.length >= 6 && /[a-z]/.test(value) && /[0-9]/.test(value)
    setPasswordError(!isValid) // 비밀번호 실시간 유효성 검사
  }

  const handleSignUp = async () => {
    if (passwordError) {
      Swal.fire({
        icon: 'error',
        title: '비밀번호 오류',
        text: '비밀번호가 유효하지 않습니다. 조건을 확인해주세요.',
      })
      return
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: '비밀번호 오류',
        text: '비밀번호가 일치하지 않습니다.',
      })
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      Swal.fire({
        icon: 'error',
        title: '회원가입 실패',
        text: error.message,
      })
      return
    }

    if (data.user) {
      const userInsertError = await addUserToPublicTable(data.user.id)
      if (userInsertError) {
        Swal.fire({
          icon: 'error',
          title: '프로필 추가 실패',
          text: userInsertError.message,
        })
        return
      }

      Swal.fire({
        icon: 'success',
        title: '회원가입 완료',
        text: '회원가입이 성공적으로 완료되었습니다!',
      })
    }
  }

  const addUserToPublicTable = async (userId: string) => {
    const imgUrl = profileImage
      ? URL.createObjectURL(profileImage)
      : '/dingco.png'

    const { error } = await supabase.from('users').insert([
      {
        id: userId,
        created_at: new Date().toISOString(),
        nickname: nickname || '',
        img_url: imgUrl,
        Exp: 0,
        Lv: 1,
      },
    ])

    return error
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
          가입하기
        </h2>
        <p className="text-center text-gray-400 mb-10">정보를 입력해주세요.</p>
        <div className="flex justify-center mb-10">
          <label htmlFor="profileImage" className="cursor-pointer">
            <div className="relative h-20 w-20 bg-gray-200 rounded-full overflow-hidden border border-gray-400">
              <Image
                src={
                  profileImage
                    ? URL.createObjectURL(profileImage)
                    : '/dingco.png'
                }
                alt="프로필 이미지"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <p className="text-center text-gray-400 text-sm mt-2">
              프로필 이미지
            </p>
          </label>
          <input
            id="profileImage"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              setProfileImage(e.target.files ? e.target.files[0] : null)
            }
          />
        </div>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border-none rounded-lg bg-[#1E1E30] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="relative">
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder="비밀번호"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
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
          {passwordError && (
            <p className="text-red-500 text-sm mt-1">
              이 비밀번호는 적합하지 않습니다.
            </p>
          )}
          <div className="relative">
            <input
              type={isConfirmPasswordVisible ? 'text' : 'password'}
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border-none rounded-lg bg-[#1E1E30] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setIsConfirmPasswordVisible((prev) => !prev)}
              className="absolute right-3 top-3 text-gray-400"
            >
              {isConfirmPasswordVisible ? '숨기기' : '보이기'}
            </button>
          </div>
          <input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full p-3 border-none rounded-lg bg-[#1E1E30] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleSignUp}
              className="w-2/4 bg-[#1E1E30] m-6 text-white p-3 rounded-full hover:bg-[#282847] text-center"
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

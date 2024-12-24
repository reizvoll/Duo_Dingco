'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import Image from 'next/image'
import { IoIosArrowDropleft } from 'react-icons/io'

export default function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false)
  const [passwordError, setPasswordError] = useState(false)

  const router = useRouter()

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    const isValid =
      value.length >= 6 && /[a-z]/.test(value) && /[0-9]/.test(value)
    setPasswordError(!isValid)
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

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          nickname,
          img_url: profileImage
            ? URL.createObjectURL(profileImage)
            : '/dingco.png',
        }),
      })

      if (!response.ok) {
        const { error } = await response.json()
        Swal.fire({
          icon: 'error',
          title: '회원가입 실패',
          text: error,
        })
        return
      }

      Swal.fire({
        icon: 'success',
        title: '회원가입 완료',
        text: '회원가입이 성공적으로 완료되었습니다!',
      })

      router.push('/auth/login')
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '오류',
        text: '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.',
      })
    }
  }

  return (
    <div className="w-full max-w-md bg-[#13132D] border border-white rounded-lg p-8 relative">
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
                profileImage ? URL.createObjectURL(profileImage) : '/dingco.png'
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
            onChange={(e) => handlePasswordChange(e.target.value)}
            className={`w-full p-3 border-none rounded-lg bg-[#1E1E30] text-white placeholder-gray-400 focus:outline-none ${
              passwordError
                ? 'ring-red-500 focus:ring-red-500'
                : 'focus:ring-blue-500'
            }`}
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
            비밀번호를 다시 확인해주세요.
          </p>
        )}

        <div className="relative">
          <input
            type={isConfirmPasswordVisible ? 'text' : 'password'}
            placeholder="비밀번호 확인 입력창"
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
          placeholder="닉네임 입력창"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full p-3 border-none rounded-lg bg-[#1E1E30] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleSignUp}
          className="w-2/4 bg-[#1E1E30] m-6 text-white p-3 rounded-full hover:bg-[#282847] text-center"
        >
          회원가입
        </button>
      </div>
    </div>
  )
}

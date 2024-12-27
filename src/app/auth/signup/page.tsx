'use client'

import { useState } from 'react'
import Swal from 'sweetalert2'
import Image from 'next/image'
import { handleSignUp } from './actions'

export default function SignUpPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>('/dingco.png') // 초기값 설정

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return '비밀번호는 6자 이상이어야 합니다.'
    }
    if (!/[a-z]/.test(password)) {
      return '비밀번호에 영문 소문자가 포함되어야 합니다.'
    }
    if (!/[0-9]/.test(password)) {
      return '비밀번호에 숫자가 포함되어야 합니다.'
    }
    return null
  }

  const handleFormSubmit = async (formData: FormData) => {
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    const validationError = validatePassword(password)
    if (validationError) {
      setPasswordError(validationError)
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

    const result = await handleSignUp(formData)

    if (result.success) {
      Swal.fire({
        icon: 'success',
        title: '회원가입 완료',
        text: result.message,
      })
      window.location.href = '/auth/login'
    } else {
      Swal.fire({
        icon: 'error',
        title: '회원가입 실패',
        text: result.message,
      })
    }
  }

  const handleProfileImageChange = (file: File | null) => {
    if (file) {
      setProfileImage(file)
      const fileUrl = URL.createObjectURL(file) // 브라우저에서 파일 URL 생성
      setPreviewUrl(fileUrl) // 미리보기 URL 업데이트
    } else {
      setPreviewUrl('/dingco.png') // 기본 이미지로 복원
    }
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        formData.append('profileImage', profileImage as File) // 프로필 이미지 추가
        await handleFormSubmit(formData)
      }}
      className="w-full max-w-md bg-[#13132D] border border-white rounded-lg p-8 relative"
      encType="multipart/form-data"
    >
      <h2 className="text-2xl font-bold text-center mt-7 text-white mb-2">
        가입하기
      </h2>
      <p className="text-center text-gray-400 mb-10">정보를 입력해주세요.</p>

      <div className="flex justify-center mb-10">
        <label htmlFor="profileImage" className="cursor-pointer">
          <div className="relative h-20 w-20 bg-gray-200 rounded-full overflow-hidden border border-gray-400">
            <Image
              src={previewUrl!} // 상태를 기반으로 이미지를 표시
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
          name="profileImage"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) =>
            handleProfileImageChange(e.target.files ? e.target.files[0] : null)
          }
        />
      </div>

      <div className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="이메일 입력"
          className="w-full p-3 border-none rounded-lg bg-[#1E1E30] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="nickname"
          placeholder="닉네임 입력"
          className="w-full p-3 border-none rounded-lg bg-[#1E1E30] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <div className="relative">
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            name="password"
            placeholder="비밀번호"
            className={`w-full p-3 border-none rounded-lg bg-[#1E1E30] text-white placeholder-gray-400 focus:outline-none ${
              passwordError
                ? 'ring-red-500 focus:ring-red-500'
                : 'focus:ring-blue-500'
            }`}
            required
            onChange={(e) => setPasswordError(validatePassword(e.target.value))}
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-400"
            onClick={() => setIsPasswordVisible((prev) => !prev)}
          >
            {isPasswordVisible ? '숨기기' : '보이기'}
          </button>
          {passwordError && (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          )}
        </div>
        <div className="relative">
          <input
            type={isConfirmPasswordVisible ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="비밀번호 확인"
            className="w-full p-3 border-none rounded-lg bg-[#1E1E30] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-400"
            onClick={() => setIsConfirmPasswordVisible((prev) => !prev)}
          >
            {isConfirmPasswordVisible ? '숨기기' : '보이기'}
          </button>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          type="submit"
          className="w-2/4 bg-[#1E1E30] m-6 text-white p-3 rounded-full hover:bg-[#282847] text-center"
        >
          회원가입
        </button>
      </div>
    </form>
  )
}

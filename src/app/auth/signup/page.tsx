'use client'

import { useState } from 'react'
import Swal from 'sweetalert2'
import Image from 'next/image'
import { handleSignUp } from './actions'
import { IoIosArrowDropleft } from 'react-icons/io'

export default function SignUpPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false)
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>('/dingco.png')

  const handleFormSubmit = async (formData: FormData) => {
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
      setPreviewUrl(URL.createObjectURL(file))
    } else {
      setPreviewUrl('/dingco.png')
    }
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        if (profileImage) formData.append('profileImage', profileImage)
        await handleFormSubmit(formData)
      }}
      className="w-full max-w-md bg-[#13132D] border border-white rounded-lg p-8 relative"
      style={{ width: '400px', height: '670px' }}
    >
      <button
        onClick={() => window.history.back()}
        className="absolute top-6 left-6 text-white text-xl"
        type="button"
      >
        <IoIosArrowDropleft size={30} />
      </button>

      <h2 className="text-2xl font-bold text-center mt-10 text-white mb-2">
        가입하기
      </h2>
      <p className="text-center text-gray-400 mb-6">정보를 입력해주세요.</p>

      <div className="flex justify-center mb-8">
        <label htmlFor="profileImage" className="cursor-pointer">
          <div className="relative h-20 w-20 bg-gray-200 rounded-full overflow-hidden border border-gray-400">
            <Image
              src={previewUrl!}
              alt="프로필 이미지"
              fill
              style={{ objectFit: 'cover' }}
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
          className="w-full p-3 rounded-lg bg-[#1E1E30] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="nickname"
          placeholder="닉네임 입력"
          className="w-full p-3 rounded-lg bg-[#1E1E30] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <div className="relative">
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            name="password"
            placeholder="비밀번호"
            className="w-full p-3 rounded-lg bg-[#1E1E30] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="relative">
          <input
            type={isConfirmPasswordVisible ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="비밀번호 확인"
            className="w-full p-3 rounded-lg bg-[#1E1E30] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      <div className="mt-8 flex justify-center">
        <button
          type="submit"
          className="w-2/4 bg-[#1E1E30] text-white py-3 rounded-full hover:bg-[#282847] text-center"
        >
          회원가입
        </button>
      </div>
    </form>
  )
}

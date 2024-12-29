'use client'

import { NicknameInputProps } from '@/types/NicknameInputProps'

export default function NicknameInput({
  nickname,
  setNickname,
}: NicknameInputProps) {
  return (
    <div className="mt-6">
      <label className="text-sm text-gray-400">닉네임</label>
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className="bg-[#E8E8E8] rounded-lg h-[38px] pl-4 text-[#666666] text-sm w-full outline-none mt-2"
        placeholder="닉네임을 입력하세요"
      />
    </div>
  )
}

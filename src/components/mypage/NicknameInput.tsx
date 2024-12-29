'use client'

import { NicknameInputProps } from '@/types/NicknameInputProps'

export default function NicknameInput({
  nickname,
  setNickname,
}: NicknameInputProps) {
  return (
    <div className="flex flex-col mt-10 w-full">
      <div className="flex items-center gap-4">
        <label className="text-sm w-[60px]">닉네임</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="bg-[#E8E8E8] rounded-lg h-[38px] pl-4 text-[#666666] text-sm w-full outline-none"
          placeholder="닉네임을 입력하세요"
        />
      </div>
    </div>
  )
}
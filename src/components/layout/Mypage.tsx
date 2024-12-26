'use client'

const Mypage = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-white p-5 rounded-lg">
        <h2 className="text-xl">마이페이지</h2>
        <button onClick={onClose} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          닫기
        </button>
      </div>
    </div>
  )
}

export default Mypage
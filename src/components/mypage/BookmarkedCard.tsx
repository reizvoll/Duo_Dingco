import { Post } from '@/types/mypageTypes'
import Image from 'next/image'
import { FaStar, FaRegStar } from 'react-icons/fa6'

// 북마크 카드 Props
type BookmarkCardProps = {
  post: Post
  onToggleBookmark: (id: string) => void
  handleGoToDetails: (id: string) => void
}

// 북마크 카드 컴포넌트
export default function BookmarkedCard({
  post,
  onToggleBookmark,
  handleGoToDetails,
}: BookmarkCardProps) {
  return (
    <div className="w-56 h-56 bg-[#2E3856] rounded-lg shadow-lg p-4 flex flex-col justify-between relative">
      {/* 제목 */}
      <h2 className="text-white text-lg font-semibold truncate mb-2">
        {post.title}
      </h2>

      {/* 프로필 섹션 */}
      <div className="flex items-center gap-4">
        <Image
          src={post.users.img_url || '/dingco.png'}
          alt="Profile"
          width={35}
          height={35}
          className="rounded-full"
        />
        <p className="text-gray-300">{post.users.nickname}</p>

        {/* 북마크 토글 버튼 */}
        <button onClick={() => onToggleBookmark(post.id)} className="ml-auto">
          {post.isBookmarked ? <FaStar size={30} /> : <FaRegStar size={30} />}
        </button>
      </div>

      {/* 단어 수 표시 */}
      <div className="flex items-center justify-center mt-6">
        <div
          className="text-lg rounded-lg bg-[#282E3E] text-center text-white flex items-center justify-center
            cursor-pointer hover:bg-[#3f475e] transition duration-300 
            h-14 w-28 sm:h-16 sm:w-32 md:h-18 md:w-36 lg:h-18 lg:w-36"
          onClick={() => handleGoToDetails(post.id)}
        >
          {post.words.length} 단어
        </div>
      </div>
    </div>
  )
}

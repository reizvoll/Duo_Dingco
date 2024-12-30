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
    <div className="w-56 h-56 bg-[#2E3856] rounded-lg shadow-lg">
      <div className="w-full h-full flex flex-col p-6">
        {/* 제목 */}
        <h2 className="text-lg font-semibold truncate mb-2 text-white">
          {post.title}
        </h2>
  
        {/* 프로필 섹션 */}
        <div className="text-sm flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Image
              src={post.users?.img_url || '/dingco.png'}
              alt="Profile"
              width={35}
              height={35}
              className="rounded-full border"
            />
            <p>{post.users?.nickname || 'Unknown User'}</p>
          </div>
          <button
            className="ml-4"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(post.id);
            }}
          >
            {post.isBookmarked ? (
              <FaStar className="w-[30px] h-[30px]" />
            ) : (
              <FaRegStar className="w-[30px] h-[30px]" />
            )}
          </button>
        </div>
  
        {/* 단어 수 표시 */}
        <div className="flex items-center justify-center mt-6">
          <div
            className="text-lg rounded-lg bg-[#282E3E] text-center text-white flex items-center justify-center
              cursor-pointer hover:bg-[#3f475e] transition duration-300 
              h-14 w-28 sm:h-16 sm:w-32"
            onClick={() => handleGoToDetails(post.id)}
          >
            {post.words.length} 단어
          </div>
        </div>
      </div>
    </div>
  )
}
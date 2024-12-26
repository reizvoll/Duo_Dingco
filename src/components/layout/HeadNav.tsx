import Link from 'next/link'
import { GoHome } from 'react-icons/go'
import { MdOutlineBookmarks } from 'react-icons/md'
import ClientSideActions from './SideActionClient'
import ModalHandler from './ModalHandler'
import { User } from '@/types/user'

interface HeadNavProps {
  user: User | null
}

export default function HeadNav({ user }: HeadNavProps) {
  return (
    <div className="absolute top-5 right-5 w-[242px] h-[50px] bg-[rgba(137,137,137,0.4)] backdrop-blur-[2px] rounded-[30px] flex items-center justify-around px-5 z-30">
      <Link href="/" passHref>
        <GoHome className="text-white w-[30px] h-[30px] cursor-pointer" />
      </Link>

      <Link href="/mypage" passHref>
        <MdOutlineBookmarks className="text-white w-[25px] h-[25px] cursor-pointer" />
      </Link>

      <ClientSideActions user={user} />
      <ModalHandler />
    </div>
  )
}
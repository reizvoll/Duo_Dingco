import Link from 'next/link'
import { GoHome } from 'react-icons/go'
import  ProtectedLogin from './ProtectedLogin'
import ModalHandler from './ModalHandler'
import { User } from '@/types/user'
import ProtectedBookmarks from './ProtectedBookmarks'

export default function HeadNav() {
  return (
    <div className="absolute top-5 right-5 w-[242px] h-[50px] bg-[#898989] bg-opacity-40 backdrop-blur-[2px] rounded-[30px] flex items-center justify-around px-5 z-30">
      <Link href="/" passHref>
        <GoHome className="text-white w-[30px] h-[30px] cursor-pointer" />
      </Link>

      <ProtectedBookmarks />  {/* user prop 제거 */}
      <ProtectedLogin />  {/* user prop 제거 */}
      <ModalHandler />
    </div>
  )
}
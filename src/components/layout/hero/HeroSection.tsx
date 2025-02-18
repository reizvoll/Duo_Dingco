import dynamic from 'next/dynamic'
import Image from 'next/image'

const HeroButton = dynamic(() => import('./HeroButton'), { ssr: false })

export default async function HeroSection() {
  return (
<section className="flex flex-col items-center justify-center py-20 min-h-screen relative">
  {/* 로고와 텍스트 */}
  <div className="relative flex flex-col items-center justify-center">
    <Image
      src="/duodingco_logo.png"
      alt="듀오딩코 로고이미지"
      width={400}
      height={400}
      className="z-10 opacity-90"
      style={{ maxWidth: '30vw', maxHeight: '30vw' }}
      priority
    />
    <p className="text-xl leading-relaxed -mt-20 z-20 hidden md:block text-center">
      <strong className="text-white">듀오딩코</strong>는 코딩 관련 내용을
      <br />
      날말카드로 쉽게 학습할 수 있도록 돕는 ‘학습 플랫폼’입니다.
    </p>
  </div>

  {/* 로그인 or 학습하기 버튼 */}
  <div className="relative z-20 m-4">
    <HeroButton />
  </div>

  {/* 히어로 섹션 이미지 */}
  <div className="flex flex-col items-center -mt-5">
    <Image
      src="/herosection.png"
      alt="딩코실력에 잠이와요?"
      width={300}
      height={300}
      className="max-w-[30vw] max-h-[30vw]"
    />
  </div>
</section>
  )
}
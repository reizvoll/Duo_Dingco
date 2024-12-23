import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="flex flex-col items-center justify-center py-20 h-full relative">
      {/* 로고와 텍스트를 함께 감싸기 */}
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
        <p className="text-xl leading-relaxed -mt-20 z-20">
          <strong className="text-white">듀오딩코</strong>는 코딩 관련 내용을
          <br />
          날말카드로 쉽게 학습할 수 있도록 돕는 ‘학습 플랫폼’입니다.
        </p>
      </div>

      {/* 로그인 버튼 */}
      <div className="relative z-20">
        <button className="mt-6 px-16 py-2 border-2 border-gray-400 text-md rounded-2xl hover:bg-gray-100 transition">
          로그인하기
        </button>
      </div>

      {/* 히어로 섹션 이미지 */}
      <div className="flex flex-col items-center -mt-8">
        <Image
          src="/herosection.png"
          alt="딩코실력에 잠이와요?"
          width={300}
          height={300}
          className="max-w-[30vw] max-h-[30vw]"
        />
      </div>
    </section>
  );
};

export default HeroSection;
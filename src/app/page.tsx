import HeadNav from '@/components/layout/HeadNav';
import SideNav from '@/components/layout/SideNav';
import HeroSection from '@/components/layout/HeroSection';
import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="flex h-screen relative overflow-hidden">
      <SideNav />
      <HeadNav />
      <main className="flex flex-col items-center justify-center flex-1 max-w-5xl mx-auto text-center relative">
        <HeroSection />
      </main>
    </div>
  );
};

export default Home;
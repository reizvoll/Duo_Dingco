import HeroSection from '@/components/layout/HeroSection';
import React from 'react';

const Home: React.FC = () => {
  return (
    <main className="flex flex-col items-center justify-center flex-1 max-w-5xl mx-auto text-center relative">
      <HeroSection />
    </main>
  );
};

export default Home;
'use client';

import React from 'react';

interface HeroHeaderProps {
  userName: string | null;
}

const HeroHeader: React.FC<HeroHeaderProps> = ({ userName }) => {
  return (
    <div className="relative z-10 mb-12 text-center px-4">
      <div className="relative inline-block">
        <div className="absolute inset-0 animate-ping-slow rounded-full bg-pink-200 opacity-50 blur-xl z-0" />

        <div className="relative z-10 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-400 drop-shadow-lg">
          🎈 Welcome to the Birthdiary{userName ? `, ${userName}` : ''}!
        </div>
      </div>
    </div>
  );
};

export default HeroHeader;

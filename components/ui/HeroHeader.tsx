'use client';

import React from 'react';
import { Cake, Heart, Sparkles, Gift, CalendarHeart } from 'lucide-react';

interface HeroHeaderProps {
  userName: string | null;
}

const HeroHeader: React.FC<HeroHeaderProps> = ({ userName }) => {
  return (
    <section className="relative z-10 mb-7 w-full max-w-4xl">
      <div className="relative overflow-hidden rounded-[2.25rem] border-2 border-pink-100 bg-gradient-to-br from-pink-100 via-yellow-50 to-purple-100 px-5 py-6 shadow-lg sm:px-8 sm:py-8">
        <div className="absolute left-5 top-5 text-3xl">🎈</div>
        <div className="absolute right-6 top-5 text-3xl">🎉</div>


        <div className="relative mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-pink-500 shadow-md ring-4 ring-white/60">
            <Cake className="h-8 w-8" />
          </div>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-sm font-black text-pink-600 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Birthdiary
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Hi{userName ? `, ${userName}` : ''} 👋
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base font-semibold leading-7 text-slate-600">
            Your little birthday corner for the people you love. Save the dates,
            keep them close, and make every birthday feel remembered.
          </p>
        </div>


      </div>
    </section>
  );
};

export default HeroHeader;
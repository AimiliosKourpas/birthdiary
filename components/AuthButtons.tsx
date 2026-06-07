'use client';

import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';

export default function AuthButtons({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  if (isLoggedIn) return null;

  return (
    <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      <Link
        href="/signup"
        className="
          inline-flex items-center gap-2
          rounded-full
          bg-gradient-to-r from-pink-500 to-rose-400
          px-6 py-3
          text-sm font-black text-white
          shadow-md
          transition-all
          hover:-translate-y-0.5
          hover:shadow-lg
        "
      >
        <Heart className="h-4 w-4 fill-white" />
        Create your diary
      </Link>

      <Link
        href="/login"
        className="
          inline-flex items-center gap-2
          rounded-full
          border-2 border-pink-200
          bg-white
          px-6 py-3
          text-sm font-black text-pink-600
          shadow-sm
          transition-all
          hover:bg-pink-50
        "
      >
        Sign in
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
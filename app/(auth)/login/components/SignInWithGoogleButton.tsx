'use client';

import React from 'react';
import { Chrome } from 'lucide-react';
import { signInWithGoogle } from '@/lib/auth-actions';

const SignInWithGoogleButton = () => {
  return (
    <button
      type="button"
      onClick={() => signInWithGoogle()}
      className="
        flex h-12 w-full items-center justify-center gap-3
        rounded-full
        border-2 border-pink-100
        bg-white
        px-5
        text-sm font-black text-slate-700
        shadow-sm
        transition-all
        hover:-translate-y-0.5
        hover:border-pink-200
        hover:bg-pink-50
        hover:shadow-md
      "
    >
      <Chrome className="h-4 w-4 text-pink-500" />

      <span>
        Continue with Google
      </span>
    </button>
  );
};

export default SignInWithGoogleButton;
'use client'

import Link from 'next/link'

export default function AuthButtons({ isLoggedIn }: { isLoggedIn: boolean }) {
  if (isLoggedIn) return null

  return (
    <div className="mt-8 flex justify-center gap-6">
      <Link
        href="/signup"
        className="px-5 py-2 rounded-lg bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
      >
        Sign Up
      </Link>
      <Link
        href="/login"
        className="px-5 py-2 rounded-lg border border-pink-400 text-pink-600 font-semibold hover:bg-pink-50 transition"
      >
        Sign In
      </Link>
    </div>
  )
}

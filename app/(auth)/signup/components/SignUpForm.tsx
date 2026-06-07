'use client';

import Link from 'next/link';
import { useState } from 'react';
import { UserPlus, Cake, Mail, Lock, UserRound } from 'lucide-react';
import { signup } from '@/lib/auth-actions';
import FormWrapper from '@/components/ui/FormWrapper';
import CustomDatePicker from '@/components/ui/DatePicker';

export function SignUpForm() {
  const [birthdate, setBirthdate] = useState<Date | null>(null);

  return (
    <FormWrapper
      title="Join Birthdiary"
      description="Create your little birthday diary."
      showConfetti
    >
      <form
        action={signup}
        className="rounded-[2rem] border-2 border-pink-100 bg-white p-5 shadow-lg"
      >
        <div className="mb-6 text-center">
          <div className="mb-3 text-5xl">🎂</div>
          <h1 className="text-3xl font-black">
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 bg-clip-text text-transparent">
              Create your diary
            </span>
          </h1>
          <p className="mt-2 text-sm font-bold text-slate-500">
            Start remembering the people you love.
          </p>
        </div>

        <div className="grid gap-5">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-black text-pink-600">
              <UserRound className="h-4 w-4" />
              Full name
            </label>
            <input
              name="full_name"
              id="full_name"
              placeholder="Max Robinson"
              required
              className="h-12 w-full rounded-full border-2 border-pink-100 bg-pink-50/60 px-5 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-100"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-black text-purple-600">
              <Mail className="h-4 w-4" />
              Email
            </label>
            <input
              name="email"
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              className="h-12 w-full rounded-full border-2 border-purple-100 bg-purple-50/50 px-5 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-purple-300 focus:bg-white focus:ring-4 focus:ring-purple-100"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-black text-orange-500">
              <Cake className="h-4 w-4" />
              Birthdate
            </label>

            <CustomDatePicker
              name="birthdate_picker"
              selectedDate={birthdate}
              onChange={setBirthdate}
              required
            />

            <input
              type="hidden"
              name="birthdate"
              value={
                birthdate
                  ? `${birthdate.getFullYear()}-${String(birthdate.getMonth() + 1).padStart(
                      2,
                      '0'
                    )}-${String(birthdate.getDate()).padStart(2, '0')}`
                  : ''
              }
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-black text-rose-600">
              <Lock className="h-4 w-4" />
              Password
            </label>
            <input
              name="password"
              id="password"
              type="password"
              required
              className="h-12 w-full rounded-full border-2 border-rose-100 bg-rose-50/50 px-5 text-sm font-bold text-slate-800 outline-none transition focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100"
            />
          </div>

          <button
            type="submit"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 px-5 py-3 text-sm font-black text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <UserPlus className="h-4 w-4" />
            Create account
          </button>
        </div>

        <div className="mt-6 text-center text-sm font-bold text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="font-black text-pink-600 hover:text-pink-700">
            Sign in
          </Link>
        </div>
      </form>
    </FormWrapper>
  );
}
'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Cake, Lock, LogIn, Mail } from 'lucide-react';

import { login } from '@/lib/auth-actions';
import SignInWithGoogleButton from './SignInWithGoogleButton';
import FormWrapper from '@/components/ui/FormWrapper';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    startTransition(async () => {
      const formData = new FormData();
      formData.set('email', email);
      formData.set('password', password);

      const result = await login(formData);

      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
        setPassword('');
      }
    });
  }

  return (
    <FormWrapper
      title="Welcome back"
      description="Your birthday diary is waiting for you."
      showConfetti
    >
      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] border-2 border-pink-100 bg-white p-5 shadow-lg"
      >
        <div className="mb-6 text-center">
          <div className="mb-3 text-5xl">🎂</div>

          <h1 className="text-3xl font-black">
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 bg-clip-text text-transparent">
              Login to Birthdiary
            </span>
          </h1>

          <p className="mt-2 text-sm font-bold text-slate-500">
            Come back to the birthdays you care about.
          </p>
        </div>

        <div className="grid gap-5">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-black text-pink-600">
              <Mail className="h-4 w-4" />
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 w-full rounded-full border-2 border-pink-100 bg-pink-50/60 px-5 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-100"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center">
              <label className="flex items-center gap-2 text-sm font-black text-purple-600">
                <Lock className="h-4 w-4" />
                Password
              </label>

              <Link
                href="#"
                className="ml-auto text-xs font-black text-pink-500 hover:text-pink-700"
              >
                Forgot?
              </Link>
            </div>

            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 w-full rounded-full border-2 border-purple-100 bg-purple-50/50 px-5 text-sm font-bold text-slate-800 outline-none transition focus:border-purple-300 focus:bg-white focus:ring-4 focus:ring-purple-100"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 px-5 py-3 text-sm font-black text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" />
            {isPending ? 'Logging in...' : 'Login'}
          </button>

          <SignInWithGoogleButton />
        </div>

        <div className="mt-6 text-center text-sm font-bold text-slate-500">
          New here?{' '}
          <Link href="/signup" className="font-black text-pink-600 hover:text-pink-700">
            Create your birthday diary
          </Link>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
          <Cake className="h-3.5 w-3.5 text-pink-300" />
          Birthdays feel better when remembered.
        </div>
      </form>
    </FormWrapper>
  );
}
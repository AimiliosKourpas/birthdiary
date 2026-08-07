'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, UserPlus, ArrowLeft, Cake, Heart } from 'lucide-react';
import Link from 'next/link';
import FormWrapper from '@/components/ui/FormWrapper';
import { Card, CardContent } from '@/components/ui/card';
import CustomDatePicker from '@/components/ui/DatePicker';

export default function AddFriendForm() {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/friends/add', {
        method: 'POST',
        body: JSON.stringify({
          name,
          birthday: birthday
            ? `${birthday.getFullYear()}-${String(birthday.getMonth() + 1).padStart(2, '0')}-${String(
                birthday.getDate()
              ).padStart(2, '0')}`
            : null,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await res.json().catch(() => null);

      if (res.ok) {
        setSuccess(true);
        setName('');
        setBirthday(null);
      } else {
        setError(result?.error || 'Something went wrong');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormWrapper
      title="Add a Birthday"
      description="A tiny note for someone you don’t want to forget."
      showConfetti
    >
      <Card className="overflow-hidden rounded-[2rem] border-2 border-pink-100 bg-white shadow-lg">
        <CardContent className="p-0">
          <div className="relative overflow-hidden bg-gradient-to-br from-pink-100 via-yellow-50 to-purple-100 px-6 py-7">
            <div className="absolute right-6 top-6 text-2xl">🎉</div>
            <div className="absolute bottom-5 right-8 text-2xl">✨</div>

            <Link
              href="/"
              className="relative mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-pink-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-pink-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to diary
            </Link>

            <div className="relative text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-pink-500 shadow-md">
                <Cake className="h-8 w-8" />
              </div>

              <h2 className="text-3xl font-black text-slate-900">
                Add someone special
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm font-semibold leading-6 text-slate-600">
                Save their birthday here and keep their special day close.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 px-6 py-7">
            <div>
              <label className="mb-2 block text-sm font-black text-pink-600">
                Friend’s name
              </label>
              <input
                type="text"
                placeholder="e.g. Alice Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12 w-full rounded-full border-2 border-pink-100 bg-pink-50/60 px-5 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-purple-600">
                Date of birth
              </label>
              <CustomDatePicker
                name="birthday"
                selectedDate={birthday}
                onChange={setBirthday}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-13 min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 px-5 py-3 text-sm font-black text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              <UserPlus className="h-4 w-4" />
              {loading ? 'Adding...' : 'Add to my diary'}
            </button>

            {success && (
              <div className="rounded-3xl border-2 border-green-100 bg-green-50 px-4 py-3">
                <p className="flex flex-wrap items-center gap-2 text-sm font-black text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  Added beautifully.
                  <Link href="/" className="text-pink-600 underline decoration-2 underline-offset-4">
                    See your diary
                  </Link>
                </p>
              </div>
            )}

            {error && (
              <div className="rounded-3xl border-2 border-red-100 bg-red-50 px-4 py-3">
                <p className="flex items-center gap-2 text-sm font-black text-red-700">
                  <XCircle className="h-4 w-4" />
                  {error}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
              <Heart className="h-3.5 w-3.5 fill-pink-300 text-pink-300" />
              Birthdays feel better when remembered.
            </div>
          </form>
        </CardContent>
      </Card>
    </FormWrapper>
  );
}
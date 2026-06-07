'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Trash2, UserRound, Cake } from 'lucide-react';
import CustomDatePicker from '@/components/ui/DatePicker';

interface UpdateProfileFormProps {
  initialName: string;
  initialBirthdate: string;
}

function parseISODateToLocalDate(isoDateStr: string): Date {
  const [year, month, day] = isoDateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export default function UpdateProfileForm({
  initialName,
  initialBirthdate,
}: UpdateProfileFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialName);
  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBirthdate(initialBirthdate ? parseISODateToLocalDate(initialBirthdate) : null);
  }, [initialBirthdate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const birthdateISO = birthdate
      ? `${birthdate.getFullYear()}-${String(birthdate.getMonth() + 1).padStart(2, '0')}-${String(
          birthdate.getDate()
        ).padStart(2, '0')}`
      : null;

    const res = await fetch('/api/profile/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName, birthdate: birthdateISO }),
    });

    if (res.ok) {
      setMessage({ text: 'Profile updated beautifully 🎉', type: 'success' });
    } else {
      setMessage({ text: 'Oops! There was an error updating your profile.', type: 'error' });
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border-2 border-pink-100 bg-white p-5 shadow-md"
    >
      <div className="mb-5 flex items-center gap-3">


        <div>
          <h2 className="text-xl font-black text-slate-900">Profile details</h2>
          <p className="text-sm font-semibold text-slate-500">
            Your personal birthday diary info.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-black text-pink-600">
            Full name
          </label>

          <input
            id="name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-12 w-full rounded-full border-2 border-pink-100 bg-pink-50/60 px-5 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-100"
            placeholder="Your full name"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="birthdate" className="mb-2 flex items-center gap-2 text-sm font-black text-purple-600">
            <Cake className="h-4 w-4" />
            Birthdate
          </label>

          <CustomDatePicker
            name="birthdate"
            selectedDate={birthdate}
            onChange={setBirthdate}
            placeholder="Choose your birthday"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 px-5 py-3 text-sm font-black text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {loading ? 'Saving...' : 'Save profile'}
        </button>

        <button
          type="button"
          onClick={() => router.push('/profile/delete')}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-red-50 px-5 py-3 text-sm font-black text-red-500 transition hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4" />
          Delete profile
        </button>

        {message && (
          <div
            className={`rounded-3xl border-2 px-4 py-3 text-center text-sm font-black ${
              message.type === 'success'
                ? 'border-green-100 bg-green-50 text-green-700'
                : 'border-red-100 bg-red-50 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </form>
  );
}
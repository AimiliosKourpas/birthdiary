'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UpdateProfileFormProps {
  initialName: string;
  initialBirthdate: string;
}

export default function UpdateProfileForm({
  initialName,
  initialBirthdate,
}: UpdateProfileFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialName);
  const [birthdate, setBirthdate] = useState(initialBirthdate);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await fetch('/api/profile/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName, birthdate }),
    });

    if (res.ok) {
      setMessage({ text: '🎉 Profile updated successfully!', type: 'success' });
    } else {
      setMessage({ text: 'Oops! There was an error updating your profile.', type: 'error' });
    }
    setLoading(false);
  };

  const handleDeleteClick = () => {
    router.push('/profile/delete');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-pink-50 max-w-md mx-auto p-6 rounded-xl shadow-lg space-y-6 border border-pink-200"
    >

      <div className="flex flex-col">
        <label
          htmlFor="name"
          className="mb-2 font-medium text-pink-600 hover:text-pink-800 transition"
        >
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="rounded-md border border-pink-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          placeholder="Your full name"
          required
          disabled={loading}
        />
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="birthdate"
          className="mb-2 font-medium text-pink-600 hover:text-pink-800 transition"
        >
          Birthdate
        </label>
        <input
          id="birthdate"
          type="date"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          className="rounded-md border border-pink-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          required
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full rounded-md py-3 font-semibold text-white transition 
          ${loading ? 'bg-pink-300 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700'}`}
      >
        {loading ? 'Updating...' : 'Update Profile'}
      </button>

      <button
        type="button"
        onClick={handleDeleteClick}
        className="w-full mt-2 rounded-md py-3 font-semibold text-white bg-red-600 hover:bg-red-700 transition"
      >
        Delete Profile
      </button>

      {message && (
        <p
          className={`text-center font-semibold mt-4 ${
            message.type === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}

'use client';

import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import FormWrapper from '@/components/ui/FormWrapper';
import {
  Card,
  CardContent,
} from '@/components/ui/card';

export default function AddFriendForm() {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const res = await fetch('/api/friends/add', {
      method: 'POST',
      body: JSON.stringify({ name, birthday }),
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await res.json();

    if (res.ok) {
      setSuccess(true);
      setName('');
      setBirthday('');
    } else {
      setError(result.error || 'Something went wrong');
    }

    setLoading(false);
  }

  return (
    <FormWrapper title="Add a Birthday" description="Add a friend's birthday" showConfetti>
      <Card className="shadow-none border-none bg-transparent p-0">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                placeholder="e.g. Alice Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-300 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-300 bg-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold text-lg transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-pink-500 hover:bg-pink-600 active:scale-[0.98]'
              }`}
            >
              {loading ? 'Adding...' : 'Add Friend'}
            </button>

            {success && (
              <p className="flex items-center gap-2 text-green-600 font-medium text-sm mt-2 animate-fade-in">
                <CheckCircle className="w-4 h-4" /> Friend added successfully.
              </p>
            )}

            {error && (
              <p className="flex items-center gap-2 text-red-600 font-medium text-sm mt-2 animate-fade-in">
                <XCircle className="w-4 h-4" /> {error}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </FormWrapper>
  );
}

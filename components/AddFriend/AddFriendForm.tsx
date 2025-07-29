'use client';

import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
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

    const res = await fetch('/api/friends/add', {
      method: 'POST',
      body: JSON.stringify({
        name,
        birthday: birthday
          ? `${birthday.getFullYear()}-${String(birthday.getMonth() + 1).padStart(2, '0')}-${String(birthday.getDate()).padStart(2, '0')}`
          : null,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await res.json();

    if (res.ok) {
      setSuccess(true);
      setName('');
      setBirthday(null);
    } else {
      setError(result.error || 'Something went wrong');
    }

    setLoading(false);
  }

  return (
    <FormWrapper
      title="Add a Birthday"
      description="Add your friend’s name and birthday below"
      showConfetti
    >
      <Card className="shadow-none border-none bg-transparent p-0">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-pink-700 mb-1">
                Friend’s Name
              </label>
              <input
                type="text"
                placeholder="e.g. Alice Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-300 text-gray-800 placeholder:text-gray-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-pink-700 mb-1">
                Date of Birth
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
              className={`w-full py-3 rounded-2xl font-semibold text-white text-lg transition-all ${
                loading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-pink-500 hover:bg-pink-600 active:scale-[0.98]'
              }`}
            >
              {loading ? 'Adding...' : 'Add Friend'}
            </button>
            {success && (
                <p className="flex items-center gap-2 text-green-600 font-medium text-sm mt-2 animate-fade-in">
                  <CheckCircle className="w-4 h-4" />
                  Friend added successfully.&nbsp;
                  <a href="/" className="underline hover:text-pink-700">
                    See him
                  </a>
                </p>
              )}
            {error && (
              <p className="flex items-center gap-2 text-red-600 font-medium text-sm mt-2 animate-fade-in">
                <XCircle className="w-4 h-4" />
                {error}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </FormWrapper>
  );
}

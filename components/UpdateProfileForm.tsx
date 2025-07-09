// components/UpdateProfileForm.tsx
'use client';

import { useState } from 'react';

export default function UpdateProfileForm({
  initialName,
  initialBirthdate,
}: {
  initialName: string;
  initialBirthdate: string;
}) {
  const [fullName, setFullName] = useState(initialName);
  const [birthdate, setBirthdate] = useState(initialBirthdate);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/profile/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName, birthdate }),
    });

    if (res.ok) {
      setMessage('Profile updated successfully!');
    } else {
      setMessage('Error updating profile.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <div>
        <label>Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          required
        />
      </div>
      <div>
        <label>Birthdate</label>
        <input
          type="date"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          required
        />
      </div>
      <button type="submit" className="bg-black text-white px-4 py-2 rounded">
        Update Profile
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}

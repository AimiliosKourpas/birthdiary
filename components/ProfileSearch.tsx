'use client';

import { useState, useEffect } from 'react';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  birthdate: string | null;
}

export default function ProfileSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(`/api/profile/search?q=${encodeURIComponent(query)}`);
      const json = await res.json();
      if (res.ok) {
        setResults(json.profiles);
      } else {
        setResults([]);
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  async function addFriend(profileId: string) {
    const res = await fetch('/api/friends/add', {
      method: 'POST',
      body: JSON.stringify({ linkedProfileId: profileId }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      alert('Friend added!');
    } else {
      const json = await res.json();
      alert(json.error || 'Failed to add friend');
    }
  }
  
  return (
    <div className="max-w-md mx-auto p-4">
      <input
        type="text"
        placeholder="Search users by name or email..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />

      {loading && <p>Loading...</p>}

      {!loading && results.length === 0 && query.trim() !== '' && (
        <p>No users found.</p>
      )}

      <ul>
        {results.map((profile) => (
          <li key={profile.id} className="border rounded p-2 flex justify-between items-center mb-2">
            <div>
              <div className="font-medium">{profile.full_name}</div>
              <div className="text-sm text-gray-600">{profile.email}</div>
            </div>
            <button
              onClick={() => addFriend(profile.id)}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Add Friend
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

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
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      setVisible(false);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(`/api/profile/search?q=${encodeURIComponent(query)}`);
      const json = await res.json();
      if (res.ok) {
        setResults(json.profiles);
        setVisible(true);
      } else {
        setResults([]);
        setVisible(false);
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clearSearch = () => {
    setQuery('');
    setVisible(false);
    inputRef.current?.blur();
  };

  async function addFriend(profileId: string) {
    const res = await fetch('/api/friends/add', {
      method: 'POST',
      body: JSON.stringify({ linkedProfileId: profileId }),
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await res.json();
    if (res.ok) {
      alert('🎉 Friend added!');
      clearSearch();
    } else {
      alert(json.error || 'Failed to add friend');
    }
  }

  return (
    <div ref={containerRef} className="relative w-64">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setVisible(true)}
          className="w-full p-2 pr-8 rounded-md border border-pink-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-pink-500 hover:text-pink-700"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {visible && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto animate-fade-in">
          {loading ? (
            <div className="p-3 text-sm text-pink-500">Loading...</div>
          ) : results.length === 0 ? (
            <div className="p-3 text-sm text-gray-500">No users found.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {results.map((profile) => (
                <li
                  key={profile.id}
                  className="p-3 flex justify-between items-center hover:bg-pink-50"
                >
                  <div>
                    <div className="font-semibold text-pink-700">{profile.full_name}</div>
                    <div className="text-sm text-gray-500">{profile.email}</div>
                  </div>
                  <button
                    onClick={() => addFriend(profile.id)}
                    className="px-2 py-1 bg-pink-200 text-sm text-pink-800 rounded hover:bg-pink-300"
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

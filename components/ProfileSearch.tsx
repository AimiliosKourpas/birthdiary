'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, UserPlus, Cake } from 'lucide-react';

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
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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
    <div ref={containerRef} className="relative w-full sm:w-72">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-pink-400" />

        <input
          ref={inputRef}
          type="text"
          placeholder="Search friends..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setVisible(true)}
          className="h-12 w-full rounded-full border-2 border-pink-100 bg-white px-11 pr-10 text-sm font-bold text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
        />

        {query && (
          <button
            onClick={clearSearch}
            type="button"
            aria-label="Clear search"
            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-pink-50 text-pink-500 transition hover:bg-pink-100 hover:text-pink-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {visible && (
        <div className="absolute left-0 right-0 z-50 mt-3 max-h-72 overflow-y-auto rounded-3xl border-2 border-pink-100 bg-white p-2 shadow-xl">
          {loading ? (
            <div className="flex items-center gap-2 rounded-2xl bg-pink-50 p-4 text-sm font-black text-pink-500">
              <Cake className="h-4 w-4" />
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="rounded-2xl bg-yellow-50 p-4 text-sm font-black text-orange-500">
              No users found 🎈
            </div>
          ) : (
            <ul className="space-y-2">
              {results.map((profile) => (
                <li
                  key={profile.id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-pink-50 to-yellow-50 p-3 transition hover:from-pink-100 hover:to-yellow-100"
                >
                  <div className="min-w-0">
                    <div className="truncate font-black text-slate-900">
                      {profile.full_name || 'Birthday friend'}
                    </div>
                    <div className="truncate text-xs font-semibold text-slate-500">
                      {profile.email}
                    </div>
                  </div>

                  <button
                    onClick={() => addFriend(profile.id)}
                    type="button"
                    className="shrink-0 rounded-full bg-pink-500 px-3 py-2 text-xs font-black text-white shadow-sm transition hover:bg-pink-600"
                  >
                    <span className="inline-flex items-center gap-1">
                      <UserPlus className="h-3.5 w-3.5" />
                      Add
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
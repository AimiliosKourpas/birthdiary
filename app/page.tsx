'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FriendList from '@/components/AddFriend/FriendList';
import ProfileSearch from '@/components/ProfileSearch';
import { Plus } from 'lucide-react';
import Controls from '@/components/AddFriend/Controls';
import SortAndFilter from '@/components/SortAndFilter';
import ConfettiBackground from '@/components/ui/ConfettiBackground';
import HeroHeader from '@/components/ui/HeroHeader';
import { createBrowserClient } from '@supabase/ssr';

interface Friend {
  id: string;
  name: string;
  birthday: string;
}

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'birthday'>('name');
  const [loading, setLoading] = useState(true);
  const [reloadLoading, setReloadLoading] = useState(false);
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [filter, setFilter] = useState<'all' | 'thisMonth' | 'today'>('all');
  const [sort, setSort] = useState<
    'nameAsc' | 'nameDesc' | 'birthdayMdAsc' | 'birthdayMdDesc' | 'ageAsc' | 'ageDesc'
  >('nameAsc');

  const [userName, setUserName] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const checkSessionAndFetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      // Fetch user profile once
      const userId = session.user.id;
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single();

      const name = profile?.full_name || session.user.email?.split('@')[0] || 'Friend';
      setUserName(name);

      // Fetch friends list
      await fetchFriends();

      setLoading(false);
    };

    checkSessionAndFetchUser();
  }, []);

  async function fetchFriends() {
    try {
      setReloadLoading(true);
      const res = await fetch('/api/friends/list');
      const data = await res.json();
      if (res.ok) setFriends(data.friends);
    } catch (err) {
      console.error('Failed to fetch friends:', err);
    } finally {
      setReloadLoading(false);
    }
  }

  const displayedFriends = friends
    .filter((friend) =>
      friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortBy === 'name'
        ? a.name.localeCompare(b.name)
        : new Date(a.birthday).getTime() - new Date(b.birthday).getTime()
    );

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-pink-500 text-xl">Loading...</p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-yellow-50 via-pink-100 to-blue-100 flex flex-col items-center p-8 overflow-hidden font-sans">
      <ConfettiBackground />

      {/* Pass userName to HeroHeader */}
      <HeroHeader userName={userName} />

      {/* Main Content Container */}
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <header className="flex flex-col items-start gap-4 w-full max-w-3xl mx-auto">
        <h1 className="flex items-center text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-rose-500 to-pink-400 drop-shadow-md">
  Your Diary
  <svg
    className="ml-3 w-8 h-8 text-pink-600 animate-bounce"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
</h1>


          <div className="flex items-center gap-4 w-full">
            {/* Search + Reload */}
            <Controls
              query={searchTerm}
              onQueryChange={setSearchTerm}
              reload={fetchFriends}
              loading={reloadLoading}
            />

            {/* Sort and Filter */}
            <SortAndFilter
              friends={friends}
              filter={filter}
              setFilter={setFilter}
              sort={sort}
              setSort={setSort}
              onFilteredFriends={setFilteredFriends}
              searchQuery={searchTerm}
            />

            {/* Add Friend */}
            <Link
              href="/add-friend"
              className="flex items-center justify-center px-4 py-2 rounded-lg bg-pink-200 text-pink-700 font-bold hover:bg-pink-300 transition shadow-sm text-sm"
              aria-label="Add Friend"
            >
              <Plus className="w-5 h-5" />
            </Link>
          </div>
        </header>

        <FriendList
          friends={filteredFriends}
          editingId={editingId}
          setEditingId={setEditingId}
          fetchFriends={fetchFriends}
        />

        
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes flicker {
          0%,
          100% {
            opacity: 1;
            filter: drop-shadow(0 0 4px #facc15);
          }
          50% {
            opacity: 0.7;
            filter: drop-shadow(0 0 8px #fbbf24);
          }
        }
        .animate-flicker {
          animation: flicker 1.5s infinite ease-in-out;
        }
        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        @keyframes spin-smooth {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-spin-smooth {
          animation: spin-smooth 1s linear infinite;
        }
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.2;
          }
          100% {
            transform: scale(1);
            opacity: 0.6;
          }
        }
        .animate-ping-slow {
          animation: ping-slow 6s infinite ease-in-out;
        }
      `}</style>
    </main>
  );
}

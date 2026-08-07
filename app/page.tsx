'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CalendarHeart, Gift, Plus } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

import FriendList from '@/components/AddFriend/FriendList';
import Controls from '@/components/AddFriend/Controls';
import SortAndFilter from '@/components/SortAndFilter';
import ConfettiBackground from '@/components/ui/ConfettiBackground';
import HeroHeader from '@/components/ui/HeroHeader';
import CookieConsentBanner from '@/components/CookieConsentBanner';

interface Friend {
  id: string;
  name: string;
  birthday: string;
}

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function getDaysUntilNextBirthday(birthday: string) {
  const rawToday = new Date();
  const today = new Date(rawToday.getFullYear(), rawToday.getMonth(), rawToday.getDate());
  const birthDate = new Date(birthday);

  const nextBirthday = new Date(
    today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  );

  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }

  const diff = nextBirthday.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function Home() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
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
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/about');
        return;
      }

      const userId = session.user.id;

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single();

      const name = profile?.full_name || session.user.email?.split('@')[0] || 'Friend';
      setUserName(name);

      try {
        await fetchFriends();
      } finally {
        setLoading(false);
      }
    };

    checkSessionAndFetchUser();
  }, [router]);

  async function fetchFriends() {
    try {
      setReloadLoading(true);

      const res = await fetch('/api/friends/list');
      const data = await res.json();

      if (res.ok) {
        setFriends(data.friends);
      }
    } catch (err) {
      console.error('Failed to fetch friends:', err);
    } finally {
      setReloadLoading(false);
    }
  }

  const nextBirthday = useMemo(() => {
    if (friends.length === 0) return null;

    return [...friends]
      .map((friend) => ({
        ...friend,
        daysUntil: getDaysUntilNextBirthday(friend.birthday),
      }))
      .sort((a, b) => a.daysUntil - b.daysUntil)[0];
  }, [friends]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-purple-50 px-4">
        <div className="flex min-h-screen items-center justify-center">
          <div className="rounded-3xl bg-white px-6 py-5 text-center shadow-md ring-2 ring-pink-100">
            <p className="text-lg font-black text-pink-500">
              Opening your birthday diary... 🎈
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <CookieConsentBanner />

      <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 px-4 py-6 font-sans sm:px-6 sm:py-8">
        <ConfettiBackground />

        <div className="relative z-10 mx-auto w-full max-w-4xl">          <HeroHeader userName={userName} />

          <section className="mx-auto w-full max-w-4xl">
            <div className="mb-5 space-y-4">
              <div className="relative overflow-hidden rounded-[2rem] border-2 border-yellow-200 bg-gradient-to-br from-yellow-100 via-orange-50 to-pink-100 p-5 shadow-md">
                <div className="absolute right-5 top-5 text-3xl">🎂</div>

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-white text-orange-500 shadow-sm">
                  <CalendarHeart className="h-6 w-6" />
                </div>

                <p className="text-sm font-black uppercase tracking-wide text-orange-600">
                  Next celebration
                </p>

                {nextBirthday ? (
                  <>
                    <h3 className="mt-2 text-3xl font-black text-slate-900">
                      {nextBirthday.name}
                    </h3>

                    <p className="mt-2 text-sm font-bold text-slate-600">
                      {nextBirthday.daysUntil === 0
                        ? 'Birthday is today! 🎉'
                        : nextBirthday.daysUntil === 1
                          ? 'Birthday is tomorrow ✨'
                          : `Coming in ${nextBirthday.daysUntil} days`}
                    </p>

                    <div className="mt-5 rounded-3xl bg-white/80 p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-sm font-black text-pink-600">
                        <Gift className="h-4 w-4" />
                        Don’t forget to send some love
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="mt-2 text-2xl font-black text-slate-900">
                      No birthdays yet
                    </h3>
                    <p className="mt-2 text-sm font-bold text-slate-600">
                      Add your first friend and your next celebration will appear here.
                    </p>
                  </>
                )}
              </div>

              <div className="rounded-[2rem] border-2 border-pink-100 bg-white p-4 shadow-md">
                <div className="mb-3 text-sm font-black text-pink-600">
                  Find birthdays
                </div>

                <div className="flex items-center gap-4 w-full">
                  <Controls
                    query={searchTerm}
                    onQueryChange={setSearchTerm}
                    reload={fetchFriends}
                    loading={reloadLoading}
                  />

                  <SortAndFilter
                    friends={friends}
                    filter={filter}
                    setFilter={setFilter}
                    sort={sort}
                    setSort={setSort}
                    onFilteredFriends={setFilteredFriends}
                    searchQuery={searchTerm}
                  />

                  <Link
                    href="/add-friend"
                    className="flex items-center justify-center px-4 py-2 rounded-lg bg-pink-200 text-pink-700 font-bold hover:bg-pink-300 transition shadow-sm text-sm"
                    aria-label="Add Friend"
                  >
                    <Plus className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>

            <FriendList
              friends={filteredFriends}
              editingId={editingId}
              setEditingId={setEditingId}
              fetchFriends={fetchFriends}
            />
          </section>
        </div>
      </main>
    </>
  );
}
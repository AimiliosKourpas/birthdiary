'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import FriendItem from './FriendItem';
import { Cake, PlusCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface Friend {
  id: string;
  name: string;
  birthday: string;
}

interface FriendListProps {
  friends: Friend[];
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  fetchFriends: () => void;
}

const INITIAL_VISIBLE = 8;
const LOAD_STEP = 8;

export default function FriendList({
  friends,
  editingId,
  setEditingId,
  fetchFriends,
}: FriendListProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [friends]);

  const visibleFriends = useMemo(
    () => friends.slice(0, visibleCount),
    [friends, visibleCount]
  );

  const hasMore = visibleCount < friends.length;

  useEffect(() => {
    if (!hasMore) return;

    const loader = loaderRef.current;
    if (!loader) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry.isIntersecting) {
          setVisibleCount((current) =>
            Math.min(current + LOAD_STEP, friends.length)
          );
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0,
      }
    );

    observer.observe(loader);

    return () => observer.disconnect();
  }, [hasMore, friends.length]);

  return (
    <section className="mt-6">
      {friends.length === 0 ? (
        <div className="rounded-[2rem] border-2 border-dashed border-pink-200 bg-gradient-to-br from-pink-50 via-yellow-50 to-purple-50 px-6 py-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-pink-500 shadow-md">
            <Cake className="h-8 w-8" />
          </div>

          <h3 className="text-2xl font-black text-slate-900">
            Your birthday diary is empty 🎈
          </h3>

          <p className="mx-auto mt-3 max-w-sm text-sm font-semibold leading-6 text-slate-500">
            Add your first friend and start filling this little diary with special days.
          </p>

          <Link
            href="/add-friend"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-pink-500 px-6 py-3 text-sm font-black text-white shadow-md transition hover:-translate-y-0.5 hover:bg-pink-600 hover:shadow-lg"
          >
            <PlusCircle className="h-4 w-4" />
            Add first birthday
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between rounded-3xl bg-white/70 px-5 py-4 shadow-sm ring-2 ring-pink-100">
            <div>
              <p className="text-sm font-black text-pink-600">
                Birthday list
              </p>
              <p className="text-xs font-semibold text-slate-500">
                Showing {visibleFriends.length} of {friends.length}
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-2 text-xs font-black text-yellow-700">
              <Sparkles className="h-4 w-4" />
              Keep scrolling
            </div>
          </div>

          <ul className="space-y-4">
            {visibleFriends.map((friend) => (
              <FriendItem
                key={friend.id}
                friend={friend}
                isEditing={editingId === friend.id}
                setEditingId={setEditingId}
                fetchFriends={fetchFriends}
              />
            ))}
          </ul>

          {hasMore && (
            <div
              ref={loaderRef}
              className="flex justify-center py-8 text-sm font-black text-pink-500"
            >
              Loading more birthdays... 🎂
            </div>
          )}

          {!hasMore && friends.length > INITIAL_VISIBLE && (
            <div className="py-8 text-center text-sm font-black text-purple-500">
              You reached the end of your birthday diary ✨
            </div>
          )}
        </>
      )}
    </section>
  );
}
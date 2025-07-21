'use client';

import { useState, useMemo } from 'react';
import {
  getNextBirthdayInfo,
  sortByNameAsc,
  sortByNameDesc,
  sortByBirthday,
  sortByLastBirthday,
} from '@/lib/utils';
import type { Friend } from '@/lib/types';
import { Cake, CalendarDays, User } from 'lucide-react'; // You can replace or customize icons

interface FriendsListProps {
  friends: Friend[];
}

export default function FriendsList({ friends }: FriendsListProps) {
  const [sortType, setSortType] = useState<'nameAsc' | 'nameDesc' | 'birthdayAsc' | 'birthdayDesc'>('nameAsc');

  const sortedFriends = useMemo(() => {
    switch (sortType) {
      case 'nameAsc':
        return sortByNameAsc(friends);
      case 'nameDesc':
        return sortByNameDesc(friends);
      case 'birthdayAsc':
        return sortByBirthday(friends);
      case 'birthdayDesc':
        return sortByLastBirthday(friends);
      default:
        return friends;
    }
  }, [sortType, friends]);

  return (
    <div className="space-y-6">
      {/* Sorting */}
      <div className="flex justify-end">
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value as any)}
          className="p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
        >
          <option value="nameAsc">🎈 Sort A - Z</option>
          <option value="nameDesc">🎉 Sort Z - A</option>
          <option value="birthdayAsc">🎂 Upcoming Birthdays</option>
          <option value="birthdayDesc">🕰️ Recent Birthdays</option>
        </select>
      </div>

      {/* Friend Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {sortedFriends.map((friend) => {
          const { daysLeft, age } = getNextBirthdayInfo(friend.birthday);

          return (
            <div
              key={friend.id}
              className="bg-white rounded-2xl shadow-xl p-5 flex flex-col gap-2 hover:shadow-pink-200 transition-shadow duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pink-200 text-pink-700 rounded-full flex items-center justify-center text-lg font-bold shadow-inner">
                  {friend.name[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{friend.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <CalendarDays size={14} /> {new Date(friend.birthday).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="mt-2 text-sm text-gray-700 flex items-center gap-2">
                <Cake size={16} className="text-yellow-500" />
                <span>
                  Turns <strong>{age}</strong> {age === 1 ? 'year' : 'years'} old
                  {daysLeft === 0 ? ' 🎉 Today!' : ` in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {sortedFriends.length === 0 && (
        <div className="text-center text-gray-500 italic">
          No friends yet. Add someone to get the party started! 🎉
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import {
  getDaysUntilNextBirthday,
  getCurrentAge,
} from '../../lib/friends/helpers';
import {
  Pencil,
  Trash2,
  Save,
  X,
  Cake,
  CalendarDays,
  Timer,
  Gift,
} from 'lucide-react';
import CustomDatePicker from '@/components/ui/DatePicker';

interface Friend {
  id: string;
  name: string;
  birthday: string;
}

interface FriendItemProps {
  friend: Friend;
  isEditing: boolean;
  setEditingId: (id: string | null) => void;
  fetchFriends: () => void;
}

function isBirthdayToday(birthday: string) {
  const today = new Date();
  const birthDate = new Date(birthday);

  return (
    today.getDate() === birthDate.getDate() &&
    today.getMonth() === birthDate.getMonth()
  );
}

export default function FriendItem({
  friend,
  isEditing,
  setEditingId,
  fetchFriends,
}: FriendItemProps) {
  const [editName, setEditName] = useState(friend.name);
  const [editBirthday, setEditBirthday] = useState<Date | null>(
    friend.birthday ? new Date(friend.birthday) : null
  );

  const birthdayToday = isBirthdayToday(friend.birthday);
  const daysUntil = getDaysUntilNextBirthday(friend.birthday);

  async function handleUpdate() {
    const res = await fetch('/api/friends/update', {
      method: 'POST',
      body: JSON.stringify({
        friendId: friend.id,
        name: editName,
        birthday: editBirthday?.toISOString().split('T')[0],
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      setEditingId(null);
      fetchFriends();
    } else {
      const result = await res.json();
      alert(result.error || 'Failed to update');
    }
  }

  async function handleDelete() {
    const res = await fetch('/api/friends/delete', {
      method: 'POST',
      body: JSON.stringify({ friendId: friend.id }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      fetchFriends();
    } else {
      const result = await res.json();
      alert(result.error || 'Failed to delete');
    }
  }

  if (isEditing) {
    return (
      <li className="rounded-3xl border-2 border-yellow-200 bg-yellow-50 p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-sm font-black text-yellow-700">
          <Pencil className="h-4 w-4" />
          Editing birthday
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="h-12 w-full rounded-2xl border-2 border-yellow-100 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-yellow-300 focus:ring-4 focus:ring-yellow-100"
          />

          <CustomDatePicker
            name="birthday"
            selectedDate={editBirthday}
            onChange={(date) => setEditBirthday(date)}
            required
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={handleUpdate}
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-green-500 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-green-600"
            >
              <Save className="h-4 w-4" />
              Save
            </button>

            <button
              onClick={() => setEditingId(null)}
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-black text-slate-500 shadow-sm transition hover:bg-red-50 hover:text-red-500"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li
      className={`relative overflow-hidden rounded-3xl border-2 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        birthdayToday
          ? 'border-yellow-300 bg-gradient-to-br from-yellow-100 via-orange-50 to-pink-100'
          : 'border-pink-100 bg-gradient-to-br from-white via-pink-50 to-purple-50'
      }`}
    >


      <div className="relative">
        {birthdayToday && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-yellow-300 px-4 py-2 text-xs font-black uppercase tracking-wide text-yellow-900">
            <Cake className="h-4 w-4" />
            Birthday today!
          </div>
        )}

        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black text-slate-900">
              {friend.name}
            </h3>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              {birthdayToday
                ? 'Send some love today 💌'
                : daysUntil === 1
                  ? 'Birthday is tomorrow ✨'
                  : `Birthday coming in ${daysUntil} days`}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setEditingId(friend.id)}
              type="button"
              aria-label="Edit friend"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-purple-500 shadow-sm transition hover:bg-purple-50"
            >
              <Pencil className="h-4 w-4" />
            </button>

            <button
              onClick={handleDelete}
              type="button"
              aria-label="Delete friend"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-rose-500 shadow-sm transition hover:bg-rose-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
            <div className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-pink-500">
              <CalendarDays className="h-4 w-4" />
              Birthday
            </div>
            <p className="font-black text-slate-800">
              {new Date(friend.birthday).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
              })}
            </p>
          </div>

          <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
            <div className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-purple-500">
              <Gift className="h-4 w-4" />
              Age
            </div>
            <p className="font-black text-slate-800">
              {getCurrentAge(friend.birthday)}
            </p>
          </div>

          <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
            <div className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-orange-500">
              <Timer className="h-4 w-4" />
              Next in
            </div>
            <p className="font-black text-slate-800">
              {daysUntil} days
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}
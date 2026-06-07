'use client';

import React, { useState } from 'react';
import { Friend } from '@/lib/friends/types';
import { UserPlus, Pencil, X } from 'lucide-react';

interface Props {
  onSubmit: (name: string, birthday: string) => void;
  onCancel?: () => void;
  friend?: Friend;
}

export default function FriendForm({ onSubmit, onCancel, friend }: Props) {
  const [name, setName] = useState(friend?.name || '');
  const [birthday, setBirthday] = useState(friend?.birthday || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, birthday);
    setName('');
    setBirthday('');
  };

  const isEdit = Boolean(friend);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-[1.75rem] border border-white/70 bg-white/75 p-5 shadow-lg backdrop-blur-xl"
    >
      <div>
        <label className="mb-1.5 block text-sm font-bold text-slate-700">
          Friend name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Alice Johnson"
          className="h-12 w-full rounded-2xl border border-pink-100 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-pink-300"
          required
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-bold text-slate-700">
          Birthday
        </label>
        <input
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          type="date"
          className="h-12 w-full rounded-2xl border border-pink-100 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm outline-none transition focus:ring-2 focus:ring-pink-300"
          required
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          {isEdit ? <Pencil className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
          {isEdit ? 'Update friend' : 'Add friend'}
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-200"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
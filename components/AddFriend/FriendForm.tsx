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
      className="space-y-4 p-4 rounded-xl border border-gray-200 bg-white shadow-sm"
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="👤 Friend's name"
        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-sm"
        required
      />
      <input
        value={birthday}
        onChange={(e) => setBirthday(e.target.value)}
        type="date"
        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-sm"
        required
      />

      <div className="flex gap-3 justify-end">
        <button
          type="submit"
          className={`flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg transition ${
            isEdit ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isEdit ? <Pencil className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
          {isEdit ? 'Update Friend' : 'Add Friend'}
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

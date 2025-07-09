'use client';

import { useState, useEffect } from 'react';

interface Friend {
  id: string;
  name: string;
  birthday: string;
}

export default function AddFriendForm() {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editBirthday, setEditBirthday] = useState('');

  // For search
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all friends from API
  async function fetchFriends() {
    const res = await fetch('/api/friends/list');
    const result = await res.json();

    if (res.ok) {
      setFriends(result.friends);
      setFilteredFriends(result.friends); // Initialize filtered with all friends
    } else {
      console.error(result.error);
    }
  }

  useEffect(() => {
    fetchFriends();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const query = searchTerm.trim();

      if (query === '') {
        // Empty search, show all
        setFilteredFriends(friends);
        return;
      }

      const res = await fetch(`/api/friends/search?q=${encodeURIComponent(query)}`);
      const result = await res.json();

      if (res.ok) {
        setFilteredFriends(result.friends);
      } else {
        console.error(result.error);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm, friends]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const res = await fetch('/api/friends/add', {
      method: 'POST',
      body: JSON.stringify({ name, birthday }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await res.json();

    if (res.ok) {
      setSuccess(true);
      setName('');
      setBirthday('');
      fetchFriends();
    } else {
      setError(result.error || 'Something went wrong');
    }

    setLoading(false);
  }

  async function handleDelete(friendId: string) {
    const res = await fetch('/api/friends/delete', {
      method: 'POST',
      body: JSON.stringify({ friendId }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      fetchFriends();
    } else {
      const result = await res.json();
      alert(result.error || 'Failed to delete');
    }
  }

  function startEditing(friend: Friend) {
    setEditingId(friend.id);
    setEditName(friend.name);
    setEditBirthday(friend.birthday);
  }

  async function handleUpdate() {
    if (!editingId) return;

    const res = await fetch('/api/friends/update', {
      method: 'POST',
      body: JSON.stringify({
        friendId: editingId,
        name: editName,
        birthday: editBirthday,
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

  function cancelEdit() {
    setEditingId(null);
  }

  return (
<div className="space-y-8 p-6 max-w-md mx-auto bg-white shadow-lg rounded-lg">
  {/* Add Friend Form */}
  <form onSubmit={handleSubmit} className="space-y-5">
    <h2 className="text-2xl font-extrabold text-gray-900">Add a Friend</h2>

    <input
      type="text"
      placeholder="Friend's name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />

    <input
      type="date"
      value={birthday}
      onChange={(e) => setBirthday(e.target.value)}
      className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />

    <button
      type="submit"
      className={`w-full py-3 rounded-md text-white font-semibold transition ${
        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
      }`}
      disabled={loading}
    >
      {loading ? 'Adding...' : 'Add Friend'}
    </button>

    {success && <p className="text-green-600 font-medium">Friend added successfully!</p>}
    {error && <p className="text-red-600 font-medium">{error}</p>}
  </form>

  {/* Search Bar */}
  <div>
    <input
      type="text"
      placeholder="Search friends by name..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Reload Button */}
  <div className="flex justify-end mb-2">
    <button
      onClick={fetchFriends}
      className="px-5 py-2 bg-gray-100 rounded-md text-gray-700 font-semibold hover:bg-gray-200 transition"
      disabled={loading}
    >
      Reload Friends List
    </button>
  </div>

  {/* Friends List */}
  <div>
    <h3 className="text-xl font-semibold mb-3 text-gray-900">Your Friends</h3>

    {filteredFriends.length === 0 ? (
      <p className="text-gray-500 italic">No friends found.</p>
    ) : (
      <ul className="space-y-4">
        {filteredFriends.map((friend) => (
          <li
            key={friend.id}
            className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            {editingId === friend.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  value={editBirthday}
                  onChange={(e) => setEditBirthday(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex space-x-3">
                  <button
                    onClick={handleUpdate}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-semibold"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex-1 bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500 transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">{friend.name}</div>
                  <div className="text-sm text-gray-600">Birthday: {friend.birthday}</div>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => startEditing(friend)}
                    className="text-blue-600 text-sm hover:underline font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(friend.id)}
                    className="text-red-600 text-sm hover:underline font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
</div>

  );
}

'use client';

import { useState, useEffect } from 'react';

interface Friend {
  id: string; // id is strictly string here
  name: string;
  birthday: string; // ISO date string, e.g. "1990-05-20"
}

export default function AddFriendForm() {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Editing states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editBirthday, setEditBirthday] = useState('');

  // Search term
  const [searchTerm, setSearchTerm] = useState('');

  // Filter state
  const [filter, setFilter] = useState<'all' | 'thisMonth' | 'today'>('all');

  // Sort state
  type SortOption =
  | 'nameAsc'
  | 'nameDesc'
  | 'birthdayMdAsc'
  | 'birthdayMdDesc'
  | 'ageAsc'
  | 'ageDesc';

const [sort, setSort] = useState<SortOption>('nameAsc');

  // Filtering function based on filter state
  function applyFilter(friendsList: Friend[]) {
    const today = new Date();
    if (filter === 'thisMonth') {
      return friendsList.filter(friend => {
        const bd = new Date(friend.birthday);
        return bd.getMonth() === today.getMonth();
      });
    }
    if (filter === 'today') {
      return friendsList.filter(friend => {
        const bd = new Date(friend.birthday);
        return (
          bd.getDate() === today.getDate() &&
          bd.getMonth() === today.getMonth()
        );
      });
    }
    return friendsList; // all
  }
  function getDaysUntilNextBirthday(birthday: string): number {
    const today = new Date();
    const birthDate = new Date(birthday);
    
    // Birthday this year
    const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    
    let diffTime = thisYearBirthday.getTime() - today.getTime();
    if (diffTime < 0) {
      // Birthday already passed this year, calculate for next year
      const nextYearBirthday = new Date(today.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
      diffTime = nextYearBirthday.getTime() - today.getTime();
    }
    
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  }
  
  function getCurrentAge(birthday: string): number {
    const today = new Date();
    const birthDate = new Date(birthday);
    
    let age = today.getFullYear() - birthDate.getFullYear();
    
    // Adjust if birthday hasn't happened yet this year
    const hasHadBirthdayThisYear = (
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate())
    );
    
    if (!hasHadBirthdayThisYear) age--;
    
    return age;
  }
  
  function applySort(friendsList: Friend[]) {
    const sorted = [...friendsList];
  
    const today = new Date();
  
    switch (sort) {
      case 'nameAsc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameDesc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'birthdayMdAsc':
        // Sort by month-day ignoring year
        sorted.sort((a, b) => {
          const [aMonth, aDay] = getMonthDay(a.birthday);
          const [bMonth, bDay] = getMonthDay(b.birthday);
          return aMonth === bMonth ? aDay - bDay : aMonth - bMonth;
        });
        break;
      case 'birthdayMdDesc':
        sorted.sort((a, b) => {
          const [aMonth, aDay] = getMonthDay(a.birthday);
          const [bMonth, bDay] = getMonthDay(b.birthday);
          return bMonth === aMonth ? bDay - aDay : bMonth - aMonth;
        });
        break;
      case 'ageAsc':
        // Youngest first: compare birthdate descending
        sorted.sort((a, b) => new Date(b.birthday).getTime() - new Date(a.birthday).getTime());
        break;
      case 'ageDesc':
        // Oldest first: compare birthdate ascending
        sorted.sort((a, b) => new Date(a.birthday).getTime() - new Date(b.birthday).getTime());
        break;
    }
  
    return sorted;
  }


  
  function getMonthDay(dateStr: string): [number, number] {
    const d = new Date(dateStr);
    return [d.getMonth() + 1, d.getDate()]; // getMonth() is zero-based
  }
  

  // Combine search, filter, and sort to get displayed friends
  const displayedFriends = applySort(applyFilter(filteredFriends));

  // Fetch friends from API and normalize ids to string
  async function fetchFriends() {
    const res = await fetch('/api/friends/list');
    const result = await res.json();

    if (res.ok) {
      const normalizedFriends: Friend[] = result.friends.map((f: any) => ({
        ...f,
        id: String(f.id),
      }));
      setFriends(normalizedFriends);
      setFilteredFriends(normalizedFriends);
    } else {
      console.error(result.error);
    }
  }

  useEffect(() => {
    fetchFriends();
  }, []);

  // Search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const query = searchTerm.trim();

      if (query === '') {
        setFilteredFriends(friends);
        return;
      }

      const res = await fetch(`/api/friends/search?q=${encodeURIComponent(query)}`);
      const result = await res.json();

      if (res.ok) {
        const normalizedFriends: Friend[] = result.friends.map((f: any) => ({
          ...f,
          id: String(f.id),
        }));
        setFilteredFriends(normalizedFriends);
      } else {
        console.error(result.error);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, friends]);

  // Submit new friend
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const res = await fetch('/api/friends/add', {
      method: 'POST',
      body: JSON.stringify({ name, birthday }),
      headers: { 'Content-Type': 'application/json' },
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

  // Delete friend
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

  // Start editing
  function startEditing(friend: Friend) {
    setEditingId(friend.id);
    setEditName(friend.name);
    setEditBirthday(friend.birthday);
  }

  // Update friend
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

  // Cancel editing
  function cancelEdit() {
    setEditingId(null);
  }

  return (
    <div className="space-y-8 p-6 max-w-md mx-auto bg-white shadow-lg rounded-lg">
      {/* Add Friend Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <h2 className="text-2xl font-extrabold text-gray-900">Add a Friend now</h2>

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

      {/* Filter and Sort Controls */}
      <div className="flex justify-between mb-4 space-x-3">
        {/* Filter */}
        <div>
          <label htmlFor="filter" className="mr-2 font-semibold text-gray-700">
            Filter:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'thisMonth' | 'today')}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="all">All Friends</option>
            <option value="thisMonth">Birthdays This Month</option>
            <option value="today">Birthdays Today</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label htmlFor="sort" className="mr-2 font-semibold text-gray-700">
            Sort:
          </label>
            <select
            id="sort"
            value={sort}
            onChange={(e) =>
                setSort(
                e.target.value as
                    | 'nameAsc'
                    | 'nameDesc'
                    | 'birthdayMdAsc'
                    | 'birthdayMdDesc'
                    | 'ageAsc'
                    | 'ageDesc'
                )
            }
            className="border border-gray-300 rounded-md p-2"
            >
            <option value="nameAsc">Name A-Z</option>
            <option value="nameDesc">Name Z-A</option>
            <option value="birthdayMdAsc">Birthday (Month-Day) Ascending</option>
            <option value="birthdayMdDesc">Birthday (Month-Day) Descending</option>
            <option value="ageAsc">Age: Youngest to Oldest</option>
            <option value="ageDesc">Age: Oldest to Youngest</option>
            </select>
        </div>
      </div>

      {/* Friends List */}
      <div>
        <h3 className="text-xl font-semibold mb-3 text-gray-900">Your Friends</h3>

        {displayedFriends.length === 0 ? (
          <p className="text-gray-500 italic">No friends found.</p>
        ) : (
          <ul className="space-y-4">
            {displayedFriends.map((friend) => (
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
                      <div className="text-sm text-gray-600">
                        Birthday: {friend.birthday} <br />
                        Birthday in {getDaysUntilNextBirthday(friend.birthday)} days! | Age: {getCurrentAge(friend.birthday)}
                        </div>

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

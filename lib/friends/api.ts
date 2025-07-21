import { Friend } from './types';

export async function fetchFriends(): Promise<Friend[]> {
  const res = await fetch('/api/friends/list');
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Failed to fetch');
  return result.friends.map((f: any) => ({ ...f, id: String(f.id) }));
}

export async function addFriend(name: string, birthday: string): Promise<void> {
  const res = await fetch('/api/friends/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, birthday })
  });
  if (!res.ok) {
    const result = await res.json();
    throw new Error(result.error || 'Failed to add');
  }
}

export async function updateFriend(id: string, name: string, birthday: string): Promise<void> {
  const res = await fetch('/api/friends/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ friendId: id, name, birthday })
  });
  if (!res.ok) {
    const result = await res.json();
    throw new Error(result.error || 'Failed to update');
  }
}

export async function deleteFriend(id: string): Promise<void> {
  const res = await fetch('/api/friends/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ friendId: id })
  });
  if (!res.ok) {
    const result = await res.json();
    throw new Error(result.error || 'Failed to delete');
  }
}

export async function searchFriends(query: string) {
    const res = await fetch(`/api/friends/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) {
      throw new Error('Failed to search friends');
    }
    const data = await res.json();
    return data.friends; // Or normalize here if needed
  }
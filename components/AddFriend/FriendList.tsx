'use client';
import FriendItem from './FriendItem';

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

export default function FriendList({
  friends,
  editingId,
  setEditingId,
  fetchFriends,
}: FriendListProps) {
  return (
    <div className="mt-6">
      {friends.length === 0 ? (
        <div className="text-center text-gray-500 italic bg-gray-50 py-6 rounded-lg border border-dashed border-gray-200">
          No friends yet... Add someone to start celebrating! 🥳
        </div>
      ) : (
        <ul className="space-y-4">
          {friends.map((friend) => (
            <FriendItem
              key={friend.id}
              friend={friend}
              isEditing={editingId === friend.id}
              setEditingId={setEditingId}
              fetchFriends={fetchFriends}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  getDaysUntilNextBirthday,
  getCurrentAge,
} from "../../lib/friends/helpers";
import { Pencil, Trash2, Save, X, Cake } from "lucide-react";
import CustomDatePicker from "@/components/ui/DatePicker";

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

  async function handleUpdate() {
    const res = await fetch("/api/friends/update", {
      method: "POST",
      body: JSON.stringify({
        friendId: friend.id,
        name: editName,
        birthday: editBirthday?.toISOString().split("T")[0],
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setEditingId(null);
      fetchFriends();
    } else {
      const result = await res.json();
      alert(result.error || "Failed to update");
    }
  }

  async function handleDelete() {
    const res = await fetch("/api/friends/delete", {
      method: "POST",
      body: JSON.stringify({ friendId: friend.id }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      fetchFriends();
    } else {
      const result = await res.json();
      alert(result.error || "Failed to delete");
    }
  }

  if (isEditing) {
    return (
      <li className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow space-y-3 transition-all min-h-[170px]">
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
        />
        <CustomDatePicker
          name="birthday"
          selectedDate={editBirthday}
          onChange={(date) => setEditBirthday(date)}
          required
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleUpdate}
            className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={() => setEditingId(null)}
            className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </li>
    );
  }

  return (
    <li
      className={`relative rounded-2xl p-5 shadow-md hover:shadow-lg transition-all
      ${
        birthdayToday
          ? "bg-gradient-to-br from-yellow-100 via-yellow-300 to-yellow-200 border border-yellow-400"
          : "bg-gradient-to-br from-white via-pink-50 to-purple-100 border border-pink-200"
      }`}
    >
      <div className="flex justify-between items-start">
        <h3
          className={`text-xl font-bold ${
            birthdayToday ? "text-yellow-700" : "text-pink-700"
          } flex items-center gap-2`}
        >
          {friend.name}
          {birthdayToday && <Cake className="w-5 h-5 text-yellow-600" />}
        </h3>
        <div className="flex gap-3 text-sm">
          <button
            onClick={() => setEditingId(friend.id)}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-1 text-sm text-gray-700">
        <p>
          <span className="font-medium text-gray-900">Birthday:</span>{" "}
          <span
            className={
              birthdayToday
                ? "text-yellow-700 font-semibold"
                : "text-pink-700 font-semibold"
            }
          >
            {new Date(friend.birthday).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
            })}
          </span>
        </p>
        <p>
          <span className="font-medium text-gray-900">Age:</span>{" "}
          <span className="text-indigo-700">
            {getCurrentAge(friend.birthday)}
          </span>
        </p>
        <p>
          <span className="font-medium text-gray-900">Next Birthday In:</span>{" "}
          <span className="text-green-700">
            {getDaysUntilNextBirthday(friend.birthday)} days
          </span>
        </p>
      </div>
    </li>
  );
}

'use client';

import { useEffect, useState } from 'react';

export default function NotificationToggle() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSetting = async () => {
      const res = await fetch('/api/profile/notifications');
      if (!res.ok) {
        setError('Failed to fetch settings');
        setLoading(false);
        return;
      }
      const settingsData = await res.json();

      if (settingsData?.notifications_enabled !== undefined) {
        setEnabled(settingsData.notifications_enabled);
      }
      setLoading(false);
    };

    fetchSetting();
  }, []);

  const toggle = async () => {
    setLoading(true);
    setError(null);

    const res = await fetch('/api/profile/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ enabled: !enabled }),
    });

    const data = await res.json();

    if (res.ok) {
      setEnabled(!enabled);
    } else {
      setError(data.error || 'Failed to update setting');
    }

    setLoading(false);
  };

  return (
    <div className="mt-6 bg-gradient-to-br from-white via-rose-50 to-pink-50 border border-pink-100 rounded-2xl p-5 shadow-lg transition-all duration-300 ease-in-out">
      <h2 className="text-xl font-semibold text-pink-600 mb-3">
        🎂 Birthday Notifications
      </h2>

      {loading ? (
        <p className="text-gray-600">Loading settings...</p>
      ) : (
        <>
          <p className="mb-4 text-gray-700">
            Notifications are currently{' '}
            <span className={`font-bold ${enabled ? 'text-green-600' : 'text-red-500'}`}>
              {enabled ? 'enabled ✅' : 'disabled ❌'}
            </span>
          </p>

          <button
            onClick={toggle}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm text-white ${
              enabled
                ? 'bg-red-500 hover:bg-red-600 active:scale-95'
                : 'bg-green-500 hover:bg-green-600 active:scale-95'
            }`}
          >
            {enabled ? 'Disable' : 'Enable'} Notifications
          </button>

          {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
        </>
      )}
    </div>
  );
}

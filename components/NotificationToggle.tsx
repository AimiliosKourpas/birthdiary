'use client';

import { useEffect, useState } from 'react';
import { Bell, BellOff } from 'lucide-react';

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
      headers: { 'Content-Type': 'application/json' },
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
    <div className="rounded-[2rem] border-2 border-yellow-100 bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 p-5 shadow-md">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-orange-500 shadow-sm">
          {enabled ? <Bell className="h-6 w-6" /> : <BellOff className="h-6 w-6" />}
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900">
            Birthday notifications
          </h2>
          <p className="text-sm font-semibold text-slate-500">
            Let Birthdiary help you remember.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm font-bold text-slate-500">Loading settings...</p>
      ) : (
        <>
          <div className="mb-4 rounded-3xl bg-white/80 p-4 shadow-sm">
            <p className="text-sm font-bold text-slate-600">
              Notifications are currently{' '}
              <span className={enabled ? 'text-green-600' : 'text-red-500'}>
                {enabled ? 'enabled ✅' : 'disabled ❌'}
              </span>
            </p>
          </div>

          <button
            onClick={toggle}
            disabled={loading}
            className={`min-h-12 rounded-full px-6 py-3 text-sm font-black text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 ${
              enabled
                ? 'bg-gradient-to-r from-red-400 to-rose-500'
                : 'bg-gradient-to-r from-green-400 to-emerald-500'
            }`}
          >
            {enabled ? 'Disable notifications' : 'Enable notifications'}
          </button>

          {error && (
            <p className="mt-3 text-sm font-black text-red-500">
              {error}
            </p>
          )}
        </>
      )}
    </div>
  );
}
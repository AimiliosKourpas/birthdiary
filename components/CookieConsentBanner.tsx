'use client';
import { useEffect, useState } from 'react';

const defaultPreferences = {
  functional: false,
  analytics: false,
  performance: false,
  advertisement: false,
};

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(true);
  const [customizing, setCustomizing] = useState(false);
  const [preferences, setPreferences] = useState(defaultPreferences);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent) setShowBanner(false);
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({ ...preferences, accepted: true }));
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({ ...defaultPreferences, accepted: false }));
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({ ...preferences, accepted: true }));
    setShowBanner(false);
  };

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white p-6 rounded-xl shadow-xl border border-pink-200">
        {!customizing ? (
          <>
            <h2 className="text-2xl font-bold text-pink-600 mb-3">🍪 We use cookies</h2>
            <p className="text-gray-700 mb-6">
              We use cookies to help you navigate efficiently and perform certain functions. You can customize your preferences below.
            </p>

            <div className="flex flex-wrap gap-3 justify-end">
              <button
                onClick={() => setCustomizing(true)}
                className="px-4 py-2 text-sm text-pink-600 font-medium border border-pink-500 rounded hover:bg-pink-50 transition"
              >
                Customize Preferences
              </button>
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition"
              >
                Reject All
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 text-sm bg-pink-600 text-white rounded hover:bg-pink-700 transition"
              >
                Accept All
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-pink-600 mb-4">Customize Consent Preferences</h2>

            <p className="text-gray-700 mb-6">
              You will find detailed information about all cookies under each consent category below.
              Necessary cookies are always active and cannot be disabled.
            </p>

            <ul className="space-y-4 text-left text-sm">
              <li>
                <label className="font-semibold text-gray-800">Necessary <span className="text-xs text-gray-500">(Always Active)</span></label>
                <p className="text-gray-600">Required for basic site features like login and security. These do not store personal data.</p>
              </li>

              {[
                { key: 'functional', title: 'Functional', desc: 'Enable features like sharing, feedback, etc.' },
                { key: 'analytics', title: 'Analytics', desc: 'Track usage metrics like visitors, bounce rate.' },
                { key: 'performance', title: 'Performance', desc: 'Measure loading speed, user experience.' },
                { key: 'advertisement', title: 'Advertisement', desc: 'Show personalized ads and measure performance.' },
              ].map(({ key, title, desc }) => (
                <li key={key} className="flex items-start justify-between">
                  <div>
                    <label className="font-semibold text-gray-800">{title}</label>
                    <p className="text-gray-600">{desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    className="mt-2 w-5 h-5 text-pink-600 border-gray-300 rounded"
                    checked={preferences[key as keyof typeof preferences]}
                    onChange={() => togglePreference(key as keyof typeof preferences)}
                  />
                </li>
              ))}
            </ul>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setCustomizing(false)}
                className="text-sm text-gray-500 hover:underline"
              >
                Close
              </button>
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
              >
                Reject All
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-4 py-2 text-sm bg-pink-600 text-white rounded hover:bg-pink-700 transition"
              >
                Save My Preferences
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

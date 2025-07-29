'use client';

import { useEffect, useState } from 'react';

export default function CookieConsentBanner() {
  const [hasMounted, setHasMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleConsent = (accepted: boolean) => {
    localStorage.setItem('cookieConsent', JSON.stringify({ accepted }));
    setShowBanner(false);
  };

  if (!hasMounted || !showBanner) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-blue-50 border-t border-blue-200 shadow-sm p-4 flex items-center justify-between flex-wrap gap-4">
      <p className="text-sm text-blue-800">
        We use cookies to enhance your experience. You can accept or reject.
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => handleConsent(false)}
          className="px-4 py-1 text-sm rounded border border-blue-300 text-blue-700 hover:bg-blue-100"
        >
          Reject
        </button>
        <button
          onClick={() => handleConsent(true)}
          className="px-4 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Accept
        </button>
      </div>
    </div>
  );
}

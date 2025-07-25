'use client';

import { X } from 'lucide-react';

export default function InstallInstructions({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-pink-600 mb-4">📲 Install as App</h2>

        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <strong className="block text-pink-500 mb-1">For iOS (Safari):</strong>
            <p>
              Tap the <span className="font-bold">Share</span> button
              <br />→ then choose <span className="font-bold">"Add to Home Screen"</span>.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <strong className="block text-pink-500 mb-1">For Android (Chrome):</strong>
            <p>
              Tap the <span className="font-bold">3-dot menu</span> top-right
              <br />→ then choose <span className="font-bold">"Install App"</span>.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 rounded-full bg-pink-500 text-white font-medium hover:bg-pink-600 transition"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}

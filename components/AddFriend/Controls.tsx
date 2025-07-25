'use client';

import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, Search, X } from 'lucide-react';

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  reload: () => void;
  loading?: boolean;
}

export default function Controls({ query, onQueryChange, reload, loading }: Props) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    }
    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchOpen]);

  return (
    <div ref={wrapperRef} className="flex items-center gap-3 w-full sm:w-auto relative">
      {/* SEARCH BUTTON - SHOW ONLY WHEN SEARCH CLOSED ON LAPTOP */}
      {(!searchOpen || isMobile) && (
        <button
          onClick={() => setSearchOpen((prev) => !prev)}
          aria-label="Toggle search"
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition shadow-sm"
          type="button"
        >
          <Search className="w-5 h-5" />
        </button>
      )}

      {/* SEARCH INPUT */}
      {searchOpen && (
        <>
          {isMobile ? (
            // MOBILE
            <div
              className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-md px-4 py-2 w-56 ring-1 ring-blue-300 ring-opacity-40 z-50 flex"
              role="dialog"
              aria-modal="true"
            >
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Search friends..."
                className="flex-grow text-blue-700 text-sm placeholder-blue-300 bg-blue-50 rounded-md px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSearchOpen(false);
                }}
                aria-label="Search friends input"
              />
            </div>
          ) : (
            // DESKTOP
            <>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Search friends..."
                className="sm:w-64 pl-4 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSearchOpen(false);
                }}
                aria-label="Search friends"
              />
              <button
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 transition shadow-sm"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          )}
        </>
      )}

      {/* RELOAD BUTTON */}
      <button
        onClick={reload}
        disabled={loading}
        aria-label="Reload friends"
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition shadow-sm"
      >
        <RefreshCw
          className={`w-5 h-5 transition-transform ${loading ? 'animate-spin-smooth' : ''}`}
        />
      </button>
    </div>
  );
}

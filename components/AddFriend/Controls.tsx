'use client';

import React, { useEffect, useRef, useState } from 'react';
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
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }

    if (searchOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchOpen]);

  const buttonClass =
    'flex h-11 w-11 items-center justify-center rounded-full bg-white text-pink-600 shadow-md ring-2 ring-pink-100 transition hover:-translate-y-0.5 hover:bg-pink-50 hover:shadow-lg disabled:opacity-60';

  return (
    <div ref={wrapperRef} className="relative flex w-full items-center gap-2 sm:w-auto">
      {(!searchOpen || isMobile) && (
        <button
          onClick={() => setSearchOpen((prev) => !prev)}
          aria-label="Search friends"
          className={buttonClass}
          type="button"
        >
          <Search className="h-5 w-5" />
        </button>
      )}

      {searchOpen && (
        <>
          {isMobile ? (
            <div className="absolute left-0 top-full z-50 mt-3 w-64 rounded-3xl bg-white p-3 shadow-xl ring-2 ring-pink-100">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Search friends..."
                className="h-11 w-full rounded-2xl bg-pink-50 px-4 text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSearchOpen(false);
                }}
              />
            </div>
          ) : (
            <>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Search friends..."
                className="h-11 w-64 rounded-full bg-white px-5 text-sm font-semibold text-slate-700 shadow-md ring-2 ring-pink-100 placeholder:text-slate-400 focus:outline-none focus:ring-pink-300"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSearchOpen(false);
                }}
              />

              <button
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className={buttonClass}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </>
          )}
        </>
      )}

      <button
        onClick={reload}
        disabled={loading}
        aria-label="Reload friends"
        className={buttonClass}
        type="button"
      >
        <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
}
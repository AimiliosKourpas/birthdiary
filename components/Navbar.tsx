'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search, Download } from 'lucide-react';
import LoginLogoutButton from './LoginLogoutButton';
import ProfileSearch from './ProfileSearch';
import { usePathname } from 'next/navigation';
import InstallInstructions from './InstallInstructions';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [showInstallPopup, setShowInstallPopup] = useState(false);

  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    setHasMounted(true);
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsOpen(false);
    setShowSearch(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/profile', label: 'Profile' },
    { href: '/about', label: 'About' },
    { href: '/add-friend', label: 'Add Birthday' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-pink-100 bg-pink-50/90 text-pink-900 shadow-sm backdrop-blur-xl">
        <div className="mx-auto hidden max-w-screen-xl items-center justify-between px-5 py-3 md:flex">
          {!isHome ? (
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-black text-pink-600 transition hover:text-pink-700"
            >
              <span className="inline-block text-2xl">🎉</span>
              <span>Birthdiary</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2 text-xl font-black text-pink-600 select-none">
              <span className="inline-block text-2xl">🎉</span>
              <span>Birthdiary</span>
            </div>
          )}

          <div className="flex items-center gap-2 rounded-full bg-white/70 px-2 py-1 shadow-sm">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-full px-4 py-2 text-sm font-black transition ${
                    active
                      ? 'bg-pink-500 text-white shadow-sm'
                      : 'text-pink-800 hover:bg-pink-100'
                  }`}
                >
                  {label}
                </Link>
              );
            })}

            <div className="relative">
              <button
                onClick={() => setShowSearch((prev) => !prev)}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                  showSearch
                    ? 'bg-purple-100 text-purple-600'
                    : 'text-pink-700 hover:bg-pink-100'
                }`}
                aria-label="Toggle search"
                type="button"
              >
                <Search className="h-5 w-5" />
              </button>

              {showSearch && (
                <div className="absolute right-0 top-12 z-50 w-72">
                  <ProfileSearch />
                </div>
              )}
            </div>
          </div>

          <div>
            <LoginLogoutButton />
          </div>
        </div>

        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-3 md:hidden">
          {!isHome ? (
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-black text-pink-600"
            >
              <span>🎉</span>
              <span>Birthdiary</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2 text-lg font-black text-pink-600 select-none">
              <span>🎉</span>
              <span>Birthdiary</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-pink-600 shadow-sm ring-1 ring-pink-100"
              aria-label="Toggle search"
              type="button"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-pink-600 shadow-sm ring-1 ring-pink-100"
              aria-label="Toggle menu"
              type="button"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="border-t border-pink-100 bg-white/95 px-4 pb-4 pt-2 shadow-sm md:hidden">
            <div className="flex flex-col gap-2">
              {navLinks.map(({ href, label }) => {
                const active = pathname === href;

                return (
                  <Link
                    key={href}
                    href={href}
                    className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                      active
                        ? 'bg-pink-500 text-white'
                        : 'text-pink-700 hover:bg-pink-50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {label}
                  </Link>
                );
              })}

              {hasMounted && isMobile && (
                <button
                  onClick={() => {
                    setShowInstallPopup(true);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm font-black text-purple-600 hover:bg-purple-50"
                  type="button"
                >
                  <Download className="h-4 w-4" />
                  Install App
                </button>
              )}

              <div className="pt-2" onClick={() => setIsOpen(false)}>
                <LoginLogoutButton />
              </div>
            </div>
          </div>
        )}
      </nav>

      {showSearch && (
        <div className="sticky top-[65px] z-40 border-b border-pink-100 bg-white/95 px-4 py-3 shadow-sm md:hidden">
          <ProfileSearch />
        </div>
      )}

      {showInstallPopup && (
        <InstallInstructions onClose={() => setShowInstallPopup(false)} />
      )}
    </>
  );
}
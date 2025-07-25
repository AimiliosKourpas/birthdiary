'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search } from 'lucide-react';
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

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/profile', label: 'Profile' },
    { href: '/about', label: 'About' },
    { href: '/add-friend', label: 'Add Birthday' },
  ];

  return (
    <>
      <nav className="bg-pink-100 text-pink-900 shadow-md sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between relative">
          <div className="md:hidden flex-1">
            {!isHome ? (
              <Link
                href="/"
                className="text-pink-700 font-semibold text-lg select-none"
                onClick={() => setIsOpen(false)}
              >
                Birthdiary
              </Link>
            ) : (
              <div className="text-pink-700 font-semibold text-lg select-none">Home</div>
            )}
          </div>

          {!isHome && (
            <Link
              href="/"
              className="hidden md:flex items-center gap-2 text-xl font-bold"
              onClick={() => setIsOpen(false)}
            >
              <span className="animate-spin-slow">🎉</span>
              <span className="font-semibold">Birthdiary</span>
            </Link>
          )}

          <div className="hidden md:flex gap-4 items-center justify-center flex-1">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="hover:underline font-medium">
                {label}
              </Link>
            ))}

            <div className="relative flex items-center">
              <button
                onClick={() => setShowSearch((prev) => !prev)}
                className="hover:text-pink-700 transition"
                aria-label="Toggle search"
              >
                <Search />
              </button>
              {showSearch && (
                <div className="ml-2">
                  <ProfileSearch />
                </div>
              )}
            </div>

            <div onClick={() => setIsOpen(false)}>
              <LoginLogoutButton />
            </div>
          </div>

          <div className="flex gap-4 md:hidden items-center justify-end flex-1">
            <button
              onClick={() => setShowSearch((prev) => !prev)}
              className="text-pink-700 hover:text-pink-900"
              aria-label="Toggle search"
            >
              <Search size={24} />
            </button>

            <button onClick={() => setIsOpen((prev) => !prev)} aria-label="Toggle menu">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg-pink-50 px-4 pb-4">
            <div className="flex flex-col gap-4">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="font-medium hover:underline"
                  onClick={() => setIsOpen(false)}
                >
                  {label}
                </Link>
              ))}

              {/* ✅ Show Install option only on mobile after mount */}
              {hasMounted && isMobile && (
                <button
                  onClick={() => {
                    setShowInstallPopup(true);
                    setIsOpen(false);
                  }}
                  className="font-medium text-left text-pink-700 hover:underline"
                >
                  📲 Install App
                </button>
              )}

              <div onClick={() => setIsOpen(false)}>
                <LoginLogoutButton />
              </div>
            </div>
          </div>
        )}
      </nav>

      {showSearch && (
        <div className="md:hidden px-4 py-2 bg-white border-t border-pink-200 shadow-sm">
          <ProfileSearch />
        </div>
      )}

      {showInstallPopup && (
        <InstallInstructions onClose={() => setShowInstallPopup(false)} />
      )}

      <style jsx>{`
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 6s linear infinite;
          display: inline-block;
        }
      `}</style>
    </>
  );
}

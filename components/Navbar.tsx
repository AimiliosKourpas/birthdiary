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

  // Scroll to top on navigation change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/profile', label: 'Profile' },
    { href: '/about', label: 'About' },
    { href: '/add-friend', label: 'Add Birthday' },
  ];

  return (
    <>
      <nav className="bg-pink-100 text-pink-900 shadow-md sticky top-0 z-50">
        {/* Desktop navbar */}
        <div className="hidden md:flex items-center justify-between max-w-screen-xl mx-auto px-4 py-3">
          {/* Left: Birthday emoji + brand */}
          {!isHome ? (
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-pink-700"
              onClick={() => setIsOpen(false)}
            >
              <span className="animate-spin-slow">🎉</span>
              <span className="font-semibold">Birthdiary</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2 text-xl font-bold text-pink-700 select-none">
              <span className="animate-spin-slow">🎉</span>
              <span className="font-semibold">Birthdiary</span>
            </div>
          )}

          {/* Center: nav links + search button */}
          <div className="flex items-center gap-6">
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
          </div>

          {/* Right: LoginLogoutButton */}
          <div onClick={() => setIsOpen(false)}>
            <LoginLogoutButton />
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="md:hidden flex items-center justify-between max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex-1">
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

          <div className="flex gap-4 items-center justify-end flex-1">
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

        {/* Mobile Menu Dropdown */}
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

      {/* Mobile Search */}
      {showSearch && (
        <div className="md:hidden px-4 py-2 bg-white border-t border-pink-200 shadow-sm">
          <ProfileSearch />
        </div>
      )}

      {/* Install Popup */}
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

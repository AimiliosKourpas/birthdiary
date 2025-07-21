'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search } from 'lucide-react';
import LoginLogoutButton from './LoginLogoutButton';
import ProfileSearch from './ProfileSearch';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleSearch = () => setShowSearch((prev) => !prev);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/profile', label: 'Profile' },
    { href: '/friends', label: 'Friends' },
    { href: '/add-friend', label: 'Add Birthday' },
  ];

  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <>
      <nav className="bg-pink-100 text-pink-900 shadow-md sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between relative">
          
          {/* MOBILE: Show page name on top-left ONLY on home page */}
          <div className="md:hidden flex-1">
            {isHome && (
              <div className="text-pink-700 font-semibold text-lg select-none">
                Home
              </div>
            )}
          </div>

          {/* Logo: desktop and mobile except when home */}
          {!isHome && (
            <Link
              href="/"
              className="hidden md:flex items-center gap-2 text-xl font-bold"
            >
              <span className="animate-spin-slow">🎉</span>
              <span className="font-semibold">Birthdiary</span>
            </Link>
          )}

{/* Desktop Nav */}
<div className="hidden md:flex gap-4 items-center justify-center flex-1">
  {navLinks.map((link) => (
    <Link
      key={link.href}
      href={link.href}
      className="hover:underline font-medium"
    >
      {link.label}
    </Link>
  ))}

  {/* Search + Inline Input */}
  <div className="relative flex items-center">
    <button
      onClick={toggleSearch}
      className="hover:text-pink-700 transition"
    >
      <Search />
    </button>
    {showSearch && (
      <div className="ml-2">
        <ProfileSearch />
      </div>
    )}
  </div>

  <LoginLogoutButton />
</div>



          {/* Mobile Icons */}
          <div className="flex gap-4 md:hidden items-center justify-end flex-1">
            <button onClick={toggleSearch} className="text-pink-700 hover:text-pink-900">
              <Search size={24} />
            </button>

            <button onClick={toggleMenu}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden bg-pink-50 px-4 pb-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-medium hover:underline"
                >
                  {link.label}
                </Link>
              ))}
              <LoginLogoutButton />
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Search Panel */}
      {showSearch && (
        <div className="md:hidden px-4 py-2 bg-white border-t border-pink-200 shadow-sm">
          <ProfileSearch />
        </div>
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

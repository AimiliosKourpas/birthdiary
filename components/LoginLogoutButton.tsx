'use client';

import React, { useEffect, useState } from 'react';
import { LogIn, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { signout } from '@/lib/auth-actions';
import type { User } from '@supabase/supabase-js';

const LoginLogoutButton = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setIsMounted(true);

    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    fetchUser();

    const { data: authListener } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  if (!isMounted) {
    return null;
  }

  const handleLogout = async () => {
    await signout();
    setUser(null);
    router.push('/login');
  };

  if (user) {
    return (
      <button
        onClick={handleLogout}
        className="
          inline-flex items-center gap-2
          rounded-full
          bg-gradient-to-r from-pink-500 to-rose-400
          px-5 py-2.5
          text-sm font-black text-white
          shadow-md
          transition-all
          hover:-translate-y-0.5
          hover:shadow-lg
        "
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    );
  }

  return (
    <button
      onClick={() => router.push('/login')}
      className="
        inline-flex items-center gap-2
        rounded-full
        border-2 border-pink-200
        bg-white
        px-5 py-2.5
        text-sm font-black text-pink-600
        shadow-sm
        transition-all
        hover:bg-pink-50
      "
    >
      <LogIn className="h-4 w-4" />
      Login
    </button>
  );
};

export default LoginLogoutButton;
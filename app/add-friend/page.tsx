'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AddFriendForm from '../../components/AddFriend/AddFriendForm';
import { createBrowserClient } from '@supabase/ssr';
import ConfettiBackground from '@/components/ui/ConfettiBackground';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AddFriendPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/about');
      } else {
        setCheckingAuth(false);
      }
    }

    checkAuth();
  }, [router]);

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-purple-50">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="rounded-3xl bg-white px-6 py-5 text-center shadow-md">
            <p className="text-lg font-black text-pink-500">Loading your diary... 🎈</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-yellow-50 to-purple-50 px-4 py-8">
      <ConfettiBackground />

      <div className="relative z-10 mx-auto w-full max-w-xl">
        <AddFriendForm />
      </div>
    </main>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AddFriendForm from '../../components/AddFriend/AddFriendForm';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AddFriendPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login'); // Redirect if NOT logged in
      } else {
        setCheckingAuth(false); // User logged in, show form
      }
    }

    checkAuth();
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <AddFriendForm />
    </div>
  );
}

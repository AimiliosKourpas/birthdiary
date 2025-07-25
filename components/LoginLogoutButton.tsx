"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { signout } from "@/lib/auth-actions";
import type { User } from "@supabase/supabase-js";

const LoginLogoutButton = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setIsMounted(true);

    // Initial fetch
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  if (!isMounted) {
    // Don't render anything on the server or before mount to avoid hydration mismatch
    return null;
  }

  const handleLogout = async () => {
    await signout();
    setUser(null);
    router.push("/login");
  };

  if (user) {
    return <Button onClick={handleLogout}>Log out</Button>;
  }

  return (
    <Button variant="outline" onClick={() => router.push("/login")}>
      Login
    </Button>
  );
};

export default LoginLogoutButton;

'use client';

import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";

const UserGreetText = () => {
  const [greeting, setGreeting] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setGreeting(null);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("full_name, birthdate")
        .eq("id", user.id)
        .single();

      if (error || !profile) {
        setGreeting(`hello ${user.email}`);
      } else {
        const formattedDate = profile.birthdate
          ? new Date(profile.birthdate).toLocaleDateString()
          : "unknown";
        setGreeting(
          `hello ${profile.full_name ?? user.email}, your birthday is ${formattedDate}`
        );
      }
    };

    fetchUserData();
  }, []);

  return (
    <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
      {greeting ? (
        <code className="font-mono font-bold">{greeting}</code>
      ) : (
        <>
          Get started editing&nbsp;
          <code className="font-mono font-bold">app/page.tsx</code>
        </>
      )}
    </p>
  );
};

export default UserGreetText;

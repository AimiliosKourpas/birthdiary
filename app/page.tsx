import AddFriendForm from "@/components/AddFriendForm";
import LoginButton from "@/components/LoginLogoutButton";
import UserGreetText from "@/components/UserGreetText";
import Image from "next/image";
import ProfileSearch from '@/components/ProfileSearch';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl flex items-center justify-between font-mono text-sm lg:flex">
        <UserGreetText />
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <LoginButton />
        </div>
      </div>
      

      <ProfileSearch />

      <AddFriendForm />
    </main>
  );
}

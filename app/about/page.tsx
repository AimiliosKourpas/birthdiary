import { createClient } from '@/utils/supabase/server';
import ClientOnly from '@/components/ClientOnly';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import AuthButtons from '@/components/AuthButtons';
import ConfettiBackground from '@/components/ui/ConfettiBackground';

export default async function AboutPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  const isLoggedIn = !!user && !userError;
  const showConfirmEmailNotice = (await searchParams).confirmEmail === '1';

  return (
    <>
      <ClientOnly>
        <CookieConsentBanner />
      </ClientOnly>

      <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-100 via-yellow-50 to-purple-100 px-4 py-8">
        <ConfettiBackground />

        <div className="absolute left-5 top-8 text-5xl">🎈</div>
        <div className="absolute right-6 top-10 text-5xl">🎉</div>
        <div className="absolute bottom-8 left-8 text-5xl">✨</div>
        <div className="absolute bottom-10 right-10 text-5xl">🎂</div>

        <section className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col items-center justify-center text-center">
          <div className="mb-5 text-7xl drop-shadow-sm">🎂</div>

          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-2 text-sm font-black text-white shadow-lg">
            ✨ Birthday Magic Starts Here
          </div>

          <h1 className="max-w-5xl text-5xl font-black leading-tight sm:text-7xl">
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Never Forget
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 bg-clip-text text-transparent">
              A Birthday Again 🎉
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg font-bold leading-8 text-slate-600">
            Birthdays are tiny celebrations of the people we love.
            <br />
            Keep them all in one happy place. 🎈
          </p>

          {showConfirmEmailNotice && (
            <div className="mx-auto mt-8 max-w-xl rounded-3xl border-2 border-green-200 bg-green-50 px-6 py-4 text-center shadow-sm">
              <p className="font-black text-green-700">
                🎉 Account created! Check your email and click the confirmation link to activate it.
              </p>
              <p className="mt-1 text-sm font-semibold text-green-600">
                Once confirmed, come back here and sign in.
              </p>
            </div>
          )}

          <div className="mt-8">
            <AuthButtons isLoggedIn={isLoggedIn} />
          </div>

          <div className="mt-12 grid w-full gap-5 sm:grid-cols-3">
            <div className="rounded-[2rem] bg-gradient-to-br from-pink-400 to-rose-500 p-6 text-white shadow-xl">
              <div className="mb-3 text-4xl">🎂</div>
              <h3 className="text-xl font-black">Save Birthdays</h3>
              <p className="mt-2 text-sm font-bold leading-6 text-white/90">
                Add your favourite people and keep every special date close.
              </p>
            </div>

            <div className="rounded-[2rem] bg-gradient-to-br from-yellow-300 to-orange-400 p-6 text-white shadow-xl">
              <div className="mb-3 text-4xl">🎁</div>
              <h3 className="text-xl font-black">Never Miss One</h3>
              <p className="mt-2 text-sm font-bold leading-6 text-white/90">
                See upcoming birthdays before they sneak up on you.
              </p>
            </div>

            <div className="rounded-[2rem] bg-gradient-to-br from-purple-400 to-indigo-500 p-6 text-white shadow-xl">
              <div className="mb-3 text-4xl">💖</div>
              <h3 className="text-xl font-black">Make People Smile</h3>
              <p className="mt-2 text-sm font-bold leading-6 text-white/90">
                Remember the little moments that make people feel loved.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
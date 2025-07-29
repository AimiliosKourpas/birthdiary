import { createClient } from '@/utils/supabase/server'
import FormWrapper from '@/components/ui/FormWrapper'
import ClientOnly from '@/components/ClientOnly'
import CookieConsentBanner from '@/components/CookieConsentBanner'
import Link from 'next/link'
import AuthButtons from '@/components/AuthButtons'

export default async function AboutPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  const isLoggedIn = !!user && !userError

  return (
    <>
      {/* Wrap client-only component */}
      <ClientOnly>
        <CookieConsentBanner />
      </ClientOnly>

      <main className="relative p-4">
        <FormWrapper
          title="Welcome to BirthDiary Buddy 🎉"
          description="Because friends' birthdays are more important than ours — let's celebrate them in style!"
          showConfetti
        >
          <div className="space-y-6 text-center text-gray-800 max-w-lg mx-auto">
            <p className="text-lg font-semibold text-pink-600">
              The app everyone should use — because remembering friends’ birthdays is the real magic.
            </p>

            <p className="text-base leading-relaxed">
              Easily add your friends’ birthdays, set up custom notifications, and keep track of all the upcoming celebrations.
              Never miss a chance to make your friends feel special!
            </p>

            <ul className="list-disc list-inside text-left text-indigo-700 font-medium max-w-sm mx-auto space-y-2">
              <li className="hover:text-pink-500 transition-colors">Add friends and their birthdays in seconds</li>
              <li className="hover:text-pink-500 transition-colors">Get timely reminders on the exact date you want</li>
              <li className="hover:text-pink-500 transition-colors">Track upcoming birthdays easily in one place</li>
            </ul>

            <p className="mt-6 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600">
              Start celebrating your friends like never before — because their day deserves confetti!
            </p>

            <p className="text-base text-gray-700 font-medium mt-6">
              🎈 Join our community of thoughtful friends who never forget a birthday!
            </p>
            <AuthButtons isLoggedIn={isLoggedIn} />
          </div>
        </FormWrapper>
      </main>
    </>
  )
}

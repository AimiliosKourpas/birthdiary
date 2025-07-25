import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import UpdateProfileForm from '@/components/UpdateProfileForm'
import FormWrapper from '@/components/ui/FormWrapper'
import NotificationToggle from '@/components/NotificationToggle'
export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/about')
  }

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('full_name, birthdate')
    .eq('id', user.id)
    .single()

  if (profileError) {
    return <p>Error loading profile data.</p>
  }

  return (
    <main className="p-4">
      <FormWrapper
        title="Update Profile"
        description="Edit your full name and birthdate"
        showConfetti
      >
        <UpdateProfileForm
          initialName={profileData?.full_name || ''}
          initialBirthdate={profileData?.birthdate || ''}
        />
        <NotificationToggle />
      </FormWrapper>
    </main>
  )
}

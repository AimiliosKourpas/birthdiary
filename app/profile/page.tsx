import { createClient } from '@/utils/supabase/server'
import UpdateProfileForm from '@/components/UpdateProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return <p>Please log in to update your profile.</p>
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
      <UpdateProfileForm
        initialName={profileData?.full_name || ''}
        initialBirthdate={profileData?.birthdate || ''}
      />
    </main>
  )
}

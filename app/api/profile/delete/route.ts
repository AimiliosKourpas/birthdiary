import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { adminSupabase } from '@/utils/supabase/adminClient'

export async function DELETE() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Delete user data from your tables
  const { error: profileError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', user.id)

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  //  Delete user from Supabase auth
  const { error: deleteUserError } = await adminSupabase.auth.admin.deleteUser(user.id)

  if (deleteUserError) {
    return NextResponse.json({ error: deleteUserError.message }, { status: 500 })
  }

  // Clear the session cookie so the client immediately sees a logged-out
  // state. Without this, the browser's cached session cookie stays
  // present until it naturally expires, since it's never told this user
  // no longer exists.
  await supabase.auth.signOut()

  return NextResponse.json({ success: true })
}

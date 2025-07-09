import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let friendName = body.name;
  let friendBirthday = body.birthday;
  let linkedProfileId = body.linkedProfileId || null; // this corresponds to linked_profile_id

  if (linkedProfileId) {
    // Fetch friend's profile data
    const { data: friendProfile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, birthdate')
      .eq('id', linkedProfileId)
      .single();

    if (profileError || !friendProfile) {
      return NextResponse.json({ error: 'Friend profile not found' }, { status: 404 });
    }

    friendName = friendProfile.full_name;
    friendBirthday = friendProfile.birthdate;
  }

  if (!friendName || !friendBirthday) {
    return NextResponse.json({ error: 'Friend name and birthday are required' }, { status: 400 });
  }

  const { error } = await supabase.from('friends').insert({
    owner_id: user.id,
    linked_profile_id: linkedProfileId,
    name: friendName,
    birthday: friendBirthday,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

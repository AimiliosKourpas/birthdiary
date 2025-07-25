import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let { data, error } = await supabase
    .from('profile_settings')
    .select('notifications_enabled')
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116' || error.message.includes('No rows found') || error.details?.includes('Results contain 0 rows')) {
      const { error: insertError } = await supabase
        .from('profile_settings')
        .insert({ user_id: user.id, notifications_enabled: true });

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      return NextResponse.json({ notifications_enabled: true });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ notifications_enabled: data?.notifications_enabled });
}

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

  const { enabled } = body;

  if (typeof enabled !== 'boolean') {
    return NextResponse.json({ error: '`enabled` must be true or false' }, { status: 400 });
  }

  const { error: updateError } = await supabase
    .from('profile_settings')
    .upsert({ user_id: user.id, notifications_enabled: enabled }, { onConflict: 'user_id' });

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

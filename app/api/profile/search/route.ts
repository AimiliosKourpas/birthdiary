import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: Request) {
  const supabase = await createClient();
  const url = new URL(req.url);
  const q = url.searchParams.get('q');

  if (!q || q.trim() === '') {
    return NextResponse.json({ profiles: [] });
  }

  const query = `%${q.trim()}%`;

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
  .from('profiles')
  .select('id, full_name, email, birthdate')
  .or(`full_name.ilike.${query},email.ilike.${query}`)
  .neq('id', user.id)
  .limit(10);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profiles: data });
}

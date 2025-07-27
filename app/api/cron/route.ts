import { adminSupabase } from '@/utils/supabase/adminClient';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import React from 'react';
import Welcome from '@/emails/WelcomeEmail';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET(req: Request) {
  // ✅ Security check
  const authHeader = req.headers.get('Authorization');
  const expectedSecret = `Bearer ${process.env.CRON_SECRET}`;
  if (authHeader !== expectedSecret) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const supabase = adminSupabase;

  const { data: users, error: usersError } = await supabase
    .from('profile_settings')
    .select('user_id')
    .eq('notifications_enabled', true);

  if (usersError || !users) {
    console.error('Error fetching users:', usersError);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }

  console.log('Users with notifications enabled:', users);

  for (const { user_id } of users) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user_id)
      .single();

    if (profileError || !profile?.email) {
      console.warn(`Skipping user ${user_id}, no profile/email found.`);
      continue;
    }

    const { data: allFriends, error: friendsError } = await supabase
      .from('friends')
      .select('name, birthday')
      .eq('owner_id', user_id);

    if (friendsError) {
      console.warn(`Failed to fetch friends for user ${user_id}`, friendsError);
      continue;
    }

    const today = new Date().toISOString().slice(5, 10);
    const friends = (allFriends || []).filter((friend) => {
      if (!friend.birthday) return false;
      const bday = new Date(friend.birthday);
      return bday.toISOString().slice(5, 10) === today;
    });

    if (friends.length === 0) continue;

    try {
      await resend.emails.send({
        from: 'no-reply@resend.dev',
        to: profile.email,
        subject: '🎉 Birthday Reminder',
        react: React.createElement(Welcome, { friends }),
      });
      console.log(`Email sent to ${profile.email}`);
    } catch (e) {
      console.error(`Email error for user ${user_id}:`, e);
    }
  }

  return NextResponse.json({ success: true });
}

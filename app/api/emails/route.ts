import React from 'react';
import { Resend } from 'resend';
import Welcome from '@/emails/WelcomeEmail';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if notifications are enabled
  const { data: settings, error: settingsError } = await supabase
    .from('profile_settings')
    .select('notifications_enabled')
    .eq('user_id', user.id)
    .single();

  if (settingsError || !settings?.notifications_enabled) {
    return NextResponse.json({ success: false, skipped: true, message: 'Notifications disabled' });
  }

  //  Fetch friends
  const { data: allFriends, error: friendsError } = await supabase
    .from('friends')
    .select('name, birthday')
    .eq('owner_id', user.id);

  if (friendsError) {
    console.error('DB error fetching friends:', friendsError);
    return NextResponse.json({ error: 'Could not fetch friends' }, { status: 500 });
  }

  const today = new Date().toISOString().slice(5, 10);

  const friends = (allFriends || []).filter((friend) => {
    if (!friend.birthday) return false;
    const bday = new Date(friend.birthday);
    const bdayMMDD = bday.toISOString().slice(5, 10);
    return bdayMMDD === today;
  });

  try {
    const emailResponse = await resend.emails.send({
      from: 'no-reply@resend.dev',
      to: user.email!,
      subject: '🎉 Birthday Reminder',
      react: React.createElement(Welcome, { friends }),
    });

    return NextResponse.json({ success: true, data: emailResponse });
  } catch (error) {
    console.error('Email sending failed:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}


import { adminSupabase } from '@/utils/supabase/adminClient';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import React from 'react';
import HappyBirthdayEmail from '@/emails/HappyBirthdayEmail';

const resend = new Resend(process.env.RESEND_API_KEY!);

function isBirthdayToday(birthdate: string) {
  const today = new Date();
  const [year, month, day] = birthdate.split('-').map(Number);
  const birthday = new Date(year, month - 1, day);

  return (
    birthday.getMonth() === today.getMonth() &&
    birthday.getDate() === today.getDate()
  );
}

export async function GET(req: Request) {
  const authHeader = req.headers.get('Authorization');
  const expectedSecret = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedSecret) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { data: profiles, error } = await adminSupabase
    .from('profiles')
    .select('id, full_name, email, birthdate')
    .not('birthdate', 'is', null)
    .not('email', 'is', null);

  if (error) {
    console.error('Failed to fetch profiles:', error);

    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }

  const birthdayUsers = (profiles || []).filter((profile) => {
    if (!profile.birthdate) return false;
    return isBirthdayToday(profile.birthdate);
  });

  for (const user of birthdayUsers) {
    try {
      await resend.emails.send({
        from: 'Birthdiary <no-reply@birthdiary.org>',
        to: user.email,
        subject: `🎂 Happy Birthday${user.full_name ? `, ${user.full_name}` : ''}!`,
        react: React.createElement(HappyBirthdayEmail, {
          name: user.full_name || 'friend',
        }),
      });

      console.log(`Happy birthday email sent to ${user.email}`);
    } catch (err) {
      console.error(`Failed to send birthday email to ${user.email}:`, err);
    }
  }

  return NextResponse.json({
    success: true,
    birthdaysFound: birthdayUsers.length,
    sent: birthdayUsers.length,
  });
}
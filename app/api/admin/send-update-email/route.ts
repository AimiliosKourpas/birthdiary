// app/api/admin/send-update-email/route.ts

import { adminSupabase } from '@/utils/supabase/adminClient';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import React from 'react';

import RebrandAnnouncementEmail from '@/emails/RebrandAnnouncementEmail';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET(req: Request) {
  const authHeader = req.headers.get('Authorization');
  const expectedSecret = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedSecret) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { data: profiles, error } = await adminSupabase
    .from('profiles')
    .select('id, full_name, email')
    .not('email', 'is', null);

  if (error) {
    console.error('Failed to fetch profiles:', error);

    return NextResponse.json(
      { success: false, error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }

  const users = profiles ?? [];

  let sent = 0;
  let failed = 0;

  const results = [];

  for (const user of users) {
    try {
      const result = await resend.emails.send({
        from: 'BirthDiary <no-reply@birthdiary.org>',
        to: user.email,
        subject: '🎉 Birthdiary got a fresh new look!',
        react: React.createElement(RebrandAnnouncementEmail, {
          name: user.full_name || 'Friend',
        }),
      });

      if (result.error) {
        failed++;

        results.push({
          id: user.id,
          email: user.email,
          ok: false,
          error: result.error,
        });

        console.error(`Resend error for ${user.email}:`, result.error);
        continue;
      }

      sent++;

      results.push({
        id: user.id,
        email: user.email,
        ok: true,
        resendId: result.data?.id,
      });

      console.log(`Email sent to ${user.email}`, result.data?.id);
    } catch (err) {
      failed++;

      results.push({
        id: user.id,
        email: user.email,
        ok: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      });

      console.error(`Failed for ${user.email}:`, err);
    }
  }

  return NextResponse.json({
    success: true,
    usersFound: users.length,
    sent,
    failed,
    results,
  });
}
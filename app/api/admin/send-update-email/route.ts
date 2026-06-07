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

  try {
    const { data: profiles, error } = await adminSupabase
      .from('profiles')
      .select('full_name,email')
      .not('email', 'is', null);

    if (error) {
      throw error;
    }

    const users = profiles ?? [];

    let sent = 0;
    let failed = 0;

    for (const user of users) {
      try {
        await resend.emails.send({
          from:
            process.env.BIRTHDIARY_FROM_EMAIL ||
            'Birthdiary <onboarding@resend.dev>',

          to: user.email,

          subject: '🎉 Birthdiary got a fresh new look!',

          react: React.createElement(RebrandAnnouncementEmail, {
            name: user.full_name || 'Friend',
          }),
        });

        sent++;
      } catch (err) {
        console.error(`Failed for ${user.email}`, err);
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      usersFound: users.length,
      sent,
      failed,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 500,
      }
    );
  }
}
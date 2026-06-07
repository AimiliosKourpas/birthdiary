// app/api/admin/send-update-email/route.ts

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import React from 'react';

import RebrandAnnouncementEmail from '@/emails/RebrandAnnouncementEmail';

const resend = new Resend(process.env.RESEND_API_KEY!);

const failedEmails = [
  'mmarnikolaki@gmail.com',
  'stkostas10@gmail.com',
  'sotiris.mam@hotmail.com',
  'mitsoupitsou@mailinator.com',
  'deniw92854@0tires.com',
  'kitaki.mala@yahoo.com',
  'oliachouliara@gmail.com',
  'malamatenia.karagianni@gmail.com',
  'nikikts012@gmail.com',
  'spkoutsos@gmail.com',
  'georgedimitriadis21@gmail.com',
  'gpapagian26@gmail.com',
  'aimiliosk2002@gmail.com',
];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(req: Request) {
  const authHeader = req.headers.get('Authorization');
  const expectedSecret = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedSecret) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  let sent = 0;
  let failed = 0;
  const results = [];

  for (const email of failedEmails) {
    try {
      const result = await resend.emails.send({
        from: 'BirthDiary <no-reply@birthdiary.org>',
        to: email,
        subject: '🎉 Birthdiary got a fresh new look!',
        react: React.createElement(RebrandAnnouncementEmail, {
          name: 'Friend',
        }),
      });

      if (result.error) {
        failed++;
        results.push({ email, ok: false, error: result.error });
      } else {
        sent++;
        results.push({ email, ok: true, resendId: result.data?.id });
      }

      await sleep(350);
    } catch (error) {
      failed++;
      results.push({
        email,
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      await sleep(350);
    }
  }

  return NextResponse.json({
    success: true,
    usersFound: failedEmails.length,
    sent,
    failed,
    results,
  });
}
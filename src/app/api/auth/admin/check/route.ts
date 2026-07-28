import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ authenticated: false }, { status: 200, headers: noCacheHeaders });
    }

    const sessionData = JSON.parse(sessionCookie.value);

    if (!sessionData || !sessionData.id) {
      return NextResponse.json({ authenticated: false }, { status: 200, headers: noCacheHeaders });
    }

    return NextResponse.json(
      {
        authenticated: true,
        admin: {
          id: sessionData.id,
          username: sessionData.username,
        },
      },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 200, headers: noCacheHeaders });
  }
}

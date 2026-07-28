import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';

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

    // Xác thực chữ ký HMAC — chặn cookie giả mạo
    const sessionData = verifySession<{ id: number; username: string }>(sessionCookie.value);
    if (!sessionData || !sessionData.id) {
      return NextResponse.json({ authenticated: false }, { status: 200, headers: noCacheHeaders });
    }

    // Kiểm tra admin có thực sự tồn tại trong database hay không
    const admin = await prisma.admin.findUnique({
      where: { id: sessionData.id },
      select: { id: true, username: true },
    });

    if (!admin) {
      // Admin đã bị xóa khỏi DB → hủy phiên
      return NextResponse.json({ authenticated: false }, { status: 200, headers: noCacheHeaders });
    }

    return NextResponse.json(
      {
        authenticated: true,
        admin: {
          id: admin.id,
          username: admin.username,
        },
      },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 200, headers: noCacheHeaders });
  }
}

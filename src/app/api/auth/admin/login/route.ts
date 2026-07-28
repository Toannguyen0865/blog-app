import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth';
import { signSession } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ tên đăng nhập và mật khẩu!' },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim();

    const admin = await prisma.admin.findUnique({
      where: { username: cleanUsername },
    });

    if (!admin || !verifyPassword(password, admin.password)) {
      return NextResponse.json(
        { error: 'Tên đăng nhập hoặc mật khẩu không chính xác!' },
        { status: 401 }
      );
    }

    const sessionData = signSession({
      id: admin.id,
      username: admin.username,
      loggedInAt: Date.now(),
    });

    const cookieStore = await cookies();
    cookieStore.set('admin_session', sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 ngày
    });

    return NextResponse.json({
      message: 'Đăng nhập thành công!',
      admin: { id: admin.id, username: admin.username },
    });
  } catch (error) {
    console.error('Login Admin Error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi đăng nhập.' },
      { status: 500 }
    );
  }
}


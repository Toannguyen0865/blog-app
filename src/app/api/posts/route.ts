import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';

// Helper kiểm tra quyền Admin từ cookie đã ký HMAC
async function getAuthenticatedAdmin() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');
    if (!sessionCookie || !sessionCookie.value) return null;
    const sessionData = verifySession<{ id: number; username: string }>(sessionCookie.value);
    if (!sessionData || !sessionData.id) return null;
    return sessionData;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // Chỉ Admin mới có thể tạo bài viết
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: 'Bạn không có quyền thực hiện thao tác này!' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { title, content, author, imageUrl, tags } = body;
    
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        author: author || 'Admin',
        imageUrl: imageUrl || null,
        tags: tags || "lập trình, công nghệ",
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

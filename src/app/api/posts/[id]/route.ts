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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Chỉ Admin mới có thể sửa bài viết
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: 'Bạn không có quyền thực hiện thao tác này!' },
      { status: 401 }
    );
  }

  try {
    const resolvedParams = await params;
    const body = await request.json();
    const { title, content, author, imageUrl, tags } = body;
    
    const post = await prisma.post.update({
      where: { id: parseInt(resolvedParams.id, 10) },
      data: {
        title,
        content,
        author,
        imageUrl: imageUrl || null,
        tags: tags !== undefined ? tags : undefined,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Chỉ Admin mới có thể xóa bài viết
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: 'Bạn không có quyền thực hiện thao tác này!' },
      { status: 401 }
    );
  }

  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);
    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}

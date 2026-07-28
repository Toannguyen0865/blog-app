import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

// Helper kiểm tra xác thực người dùng từ cookie
async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("user_session");

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  try {
    const session = JSON.parse(sessionCookie.value);
    const user = await prisma.user.findUnique({
      where: { id: session.id },
    });
    return user;
  } catch (error) {
    return null;
  }
}

// PUT /api/comments/[id] - Sửa nội dung bình luận
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { error: "Bạn cần đăng nhập để thực hiện thao tác này!" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const commentId = parseInt(resolvedParams.id, 10);
    if (isNaN(commentId)) {
      return NextResponse.json(
        { error: "ID bình luận không hợp lệ!" },
        { status: 400 }
      );
    }

    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existingComment) {
      return NextResponse.json(
        { error: "Không tìm thấy bình luận!" },
        { status: 404 }
      );
    }

    // Chỉ cho phép chính tác giả bình luận (hoặc tài khoản Admin) được sửa
    if (existingComment.userId !== user.id && user.name !== "Admin") {
      return NextResponse.json(
        { error: "Bạn không có quyền chỉnh sửa bình luận của người khác!" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Nội dung bình luận không được để trống!" },
        { status: 400 }
      );
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content: content.trim() },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("Update Comment Error:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi cập nhật bình luận." },
      { status: 500 }
    );
  }
}

// DELETE /api/comments/[id] - Xóa bình luận
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { error: "Bạn cần đăng nhập để thực hiện thao tác này!" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const commentId = parseInt(resolvedParams.id, 10);
    if (isNaN(commentId)) {
      return NextResponse.json(
        { error: "ID bình luận không hợp lệ!" },
        { status: 400 }
      );
    }

    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existingComment) {
      return NextResponse.json(
        { error: "Không tìm thấy bình luận!" },
        { status: 404 }
      );
    }

    // Chỉ cho phép chính tác giả bình luận (hoặc tài khoản Admin) được xóa
    if (existingComment.userId !== user.id && user.name !== "Admin") {
      return NextResponse.json(
        { error: "Bạn không có quyền xóa bình luận của người khác!" },
        { status: 403 }
      );
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ success: true, message: "Đã xóa bình luận thành công!" });
  } catch (error) {
    console.error("Delete Comment Error:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi xóa bình luận." },
      { status: 500 }
    );
  }
}

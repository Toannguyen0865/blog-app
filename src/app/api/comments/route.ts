import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postIdStr = searchParams.get("postId");

    if (!postIdStr) {
      return NextResponse.json(
        { error: "Thiếu tham số postId!" },
        { status: 400 },
      );
    }

    const postId = parseInt(postIdStr, 10);
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: "postId không hợp lệ!" },
        { status: 400 },
      );
    }

    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
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

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Get Comments Error:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi tải bình luận." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("user_session");

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json(
        { error: "Bạn cần đăng nhập để gửi bình luận!" },
        { status: 401 },
      );
    }

    // Xác thực chữ ký HMAC của session cookie
    const session = verifySession<{ id: number }>(sessionCookie.value);
    if (!session || !session.id) {
      return NextResponse.json(
        { error: "Phiên đăng nhập không hợp lệ!" },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn!" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { postId, content, parentId } = body;

    if (!postId || !content || !content.trim()) {
      return NextResponse.json(
        { error: "Vui lòng nhập nội dung bình luận!" },
        { status: 400 },
      );
    }

    const newComment = await prisma.comment.create({
      data: {
        postId: parseInt(postId, 10),
        userId: user.id,
        content: content.trim(),
        parentId: parentId ? parseInt(parentId, 10) : null,
      },
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

    return NextResponse.json(newComment, { status: 201 });
  } catch (error: any) {
    console.error("Post Comment Error:", error);
    let msg = "Có lỗi xảy ra khi gửi bình luận.";

    // Xử lý lỗi PostgreSQL phổ biến
    if (error?.code === "P2002") {
      msg = "Bình luận này đã tồn tại (trùng lặp dữ liệu).";
    } else if (error?.code === "P2003") {
      msg = "Bài viết không tồn tại hoặc đã bị xóa!";
    } else if (error?.code === "P2025") {
      msg = "Dữ liệu liên quan không tìm thấy!";
    } else if (error?.message?.includes("Connection") || error?.message?.includes("timeout")) {
      msg = "Không thể kết nối đến cơ sở dữ liệu. Vui lòng thử lại sau!";
    } else if (error?.message) {
      msg = `Lỗi hệ thống: ${error.message.slice(0, 120)}`;
    }

    return NextResponse.json(
      { error: msg },
      { status: 500 },
    );
  }
}

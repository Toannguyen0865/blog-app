import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const noCacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const postId = parseInt(resolvedParams.id, 10);

    if (isNaN(postId) || postId <= 0) {
      return NextResponse.json(
        { error: "ID bài viết không hợp lệ!" },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, likes: true },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Không tìm thấy bài viết!" },
        { status: 404, headers: noCacheHeaders }
      );
    }

    return NextResponse.json(
      { success: true, likes: post.likes },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (error) {
    console.error("Get Like API Error:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi lấy lượt thích." },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const postId = parseInt(resolvedParams.id, 10);

    if (isNaN(postId) || postId <= 0) {
      return NextResponse.json(
        { error: "ID bài viết không hợp lệ!" },
        { status: 400, headers: noCacheHeaders }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Dữ liệu JSON gửi lên không hợp lệ!" },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const { action } = body || {};
    if (action !== "like" && action !== "unlike") {
      return NextResponse.json(
        { error: "Hành động (action) không hợp lệ! Chỉ chấp nhận 'like' hoặc 'unlike'." },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, likes: true },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Không tìm thấy bài viết!" },
        { status: 404, headers: noCacheHeaders }
      );
    }

    // Sử dụng thao tác atomic (increment/decrement) của Prisma để tránh lỗi Race Condition (khi nhiều người cùng bấm like 1 thời điểm)
    let updateData;
    if (action === "like") {
      updateData = { likes: { increment: 1 } };
    } else {
      updateData = post.likes > 0 ? { likes: { decrement: 1 } } : { likes: 0 };
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: updateData,
      select: { id: true, likes: true },
    });

    return NextResponse.json(
      { success: true, likes: updatedPost.likes },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (error) {
    console.error("Like API Error:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi cập nhật lượt thích." },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

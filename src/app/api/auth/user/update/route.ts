import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth";

const cleanImageUrl = (val: string): string => {
  let cleaned = val.trim();
  try {
    if (cleaned.includes("google.com/imgres") || cleaned.includes("google.com/url")) {
      const urlObj = new URL(cleaned);
      const imgurl =
        urlObj.searchParams.get("imgurl") ||
        urlObj.searchParams.get("url") ||
        urlObj.searchParams.get("q");
      if (imgurl) {
        cleaned = decodeURIComponent(imgurl);
      }
    }
  } catch {
    // ignore parse errors
  }
  return cleaned;
};

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("user_session");

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ error: "Bạn chưa đăng nhập!" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    const user = await prisma.user.findUnique({
      where: { id: session.id },
    });

    if (!user) {
      return NextResponse.json({ error: "Tài khoản không tồn tại!" }, { status: 404 });
    }

    const body = await request.json();
    const { name, avatar, currentPassword, newPassword } = body;

    const updateData: { name?: string; avatar?: string; password?: string } = {};

    if (name !== undefined) {
      const trimmedName = name.trim();
      if (!trimmedName) {
        return NextResponse.json({ error: "Họ tên không được để trống!" }, { status: 400 });
      }
      updateData.name = trimmedName;
    }

    if (avatar !== undefined) {
      updateData.avatar = cleanImageUrl(avatar) || `https://ui-avatars.com/api/?name=${encodeURIComponent(updateData.name || user.name)}&background=2563eb&color=fff&bold=true`;
    }

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Vui lòng nhập mật khẩu hiện tại để xác nhận đổi mật khẩu!" },
          { status: 400 }
        );
      }
      const isPasswordValid = verifyPassword(currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Mật khẩu hiện tại không chính xác!" },
          { status: 400 }
        );
      }
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "Mật khẩu mới phải có ít nhất 6 ký tự!" },
          { status: 400 }
        );
      }
      updateData.password = hashPassword(newPassword);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    });

    // Cập nhật cookie session
    const sessionData = JSON.stringify({
      ...session,
      name: updatedUser.name,
      avatar: updatedUser.avatar,
    });

    cookieStore.set("user_session", sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 ngày
    });

    return NextResponse.json({
      message: "Cập nhật thông tin thành công!",
      user: updatedUser,
    }, { status: 200 });

  } catch (error) {
    console.error("Update User Error:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi cập nhật thông tin." },
      { status: 500 }
    );
  }
}

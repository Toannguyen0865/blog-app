import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ email và mật khẩu!" },
        { status: 400 },
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user || !verifyPassword(password, user.password)) {
      return NextResponse.json(
        { error: "Email hoặc mật khẩu không chính xác!" },
        { status: 401 },
      );
    }

    const sessionData = JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      loggedInAt: Date.now(),
    });

    const cookieStore = await cookies();
    cookieStore.set("user_session", sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 ngày
    });

    return NextResponse.json({
      message: "Đăng nhập thành công!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Login User Error:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi đăng nhập." },
      { status: 500 },
    );
  }
}

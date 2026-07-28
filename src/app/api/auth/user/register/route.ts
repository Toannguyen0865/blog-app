import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ họ tên, email và mật khẩu!" },
        { status: 400 },
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email này đã được sử dụng. Vui lòng chọn email khác hoặc đăng nhập!" },
        { status: 400 },
      );
    }

    const hashedPassword = hashPassword(password);
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      cleanName,
    )}&background=2563eb&color=fff&bold=true`;

    const newUser = await prisma.user.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
        avatar: avatarUrl,
      },
    });

    const sessionData = JSON.stringify({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
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

    return NextResponse.json(
      {
        message: "Đăng ký thành công!",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          avatar: newUser.avatar,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register User Error:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi đăng ký tài khoản." },
      { status: 500 },
    );
  }
}

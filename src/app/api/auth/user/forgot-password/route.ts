import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Vui lòng nhập email của bạn!" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Không tìm thấy tài khoản nào gắn với email này!" },
        { status: 404 }
      );
    }

    // Tạo token ngẫu nhiên
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000); // hết hạn sau 1 giờ

    // Xóa các token cũ chưa sử dụng của user này
    await prisma.passwordReset.deleteMany({
      where: { userId: user.id, used: false },
    });

    // Tạo bản ghi token mới
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // Trong môi trường thực tế sẽ gửi email qua SMTP/SendGrid.
    // Ở đây trả về link reset để hiển thị ở UI demo tiện kiểm thử.
    const resetUrl = `/reset-password?token=${token}`;

    return NextResponse.json({
      message: "Xác định tài khoản thành công! Chuyển tới trang đổi mật khẩu.",
      token,
      resetUrl,
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi xử lý yêu cầu." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    // 1. Kiểm tra xác thực người dùng
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("user_session");

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json(
        { error: "Bạn cần đăng nhập để tải ảnh lên!" },
        { status: 401 }
      );
    }

    // 2. Nhận dữ liệu form-data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Vui lòng chọn một tệp ảnh để tải lên!" },
        { status: 400 }
      );
    }

    // 3. Kiểm tra định dạng tệp (chỉ nhận hình ảnh)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Tệp tải lên phải là định dạng hình ảnh (.jpg, .png, .webp, .gif, .heic)!" },
        { status: 400 }
      );
    }

    // 4. Kiểm tra kích thước tệp (giới hạn tối đa 10MB cho iPhone)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Kích thước ảnh không được vượt quá 10MB!" },
        { status: 400 }
      );
    }

    // 5. Chuyển đổi tệp thành Buffer và sang Data URL (base64) để tương thích 100% Vercel Serverless
    // (Tránh lỗi EROFS: read-only file system khi chạy trên đám mây Vercel)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || "image/jpeg";
    const base64String = buffer.toString("base64");
    const fileUrl = `data:${mimeType};base64,${base64String}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      message: "Tải ảnh lên thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi tải ảnh lên:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi xử lý tệp tải lên trên máy chủ." },
      { status: 500 }
    );
  }
}

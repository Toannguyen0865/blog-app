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
        { error: "Tệp tải lên phải là định dạng hình ảnh (.jpg, .png, .webp, .gif)!" },
        { status: 400 }
      );
    }

    // 4. Kiểm tra kích thước tệp (giới hạn tối đa 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Kích thước ảnh không được vượt quá 5MB!" },
        { status: 400 }
      );
    }

    // 5. Chuyển đổi tệp thành Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 6. Tạo thư mục lưu trữ trong /public/uploads/avatars nếu chưa tồn tại
    const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 7. Tạo tên tệp duy nhất để không bị trùng lặp
    const ext = file.name.split(".").pop() || "jpg";
    const cleanExt = ext.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "jpg";
    const uniqueFilename = `avatar-${Date.now()}-${Math.floor(Math.random() * 10000)}.${cleanExt}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    // 8. Ghi tệp vào hệ thống
    fs.writeFileSync(filePath, buffer);

    // 9. Trả về đường dẫn tĩnh để sử dụng trên giao diện
    const fileUrl = `/uploads/avatars/${uniqueFilename}`;

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

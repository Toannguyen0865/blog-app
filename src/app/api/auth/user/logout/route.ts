import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("user_session");

    return NextResponse.json({ message: "Đăng xuất thành công!" });
  } catch (error) {
    console.error("Logout User Error:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi đăng xuất." },
      { status: 500 },
    );
  }
}

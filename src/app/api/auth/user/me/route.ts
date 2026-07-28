import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("user_session");

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const session = JSON.parse(sessionCookie.value);

    if (!session || !session.id) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.id,
        name: session.name,
        email: session.email,
        avatar: session.avatar || null,
      },
    });
  } catch (error) {
    console.error("Check User Session Error:", error);
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}

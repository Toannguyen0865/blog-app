import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const noCacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("user_session");

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ authenticated: false }, { status: 200, headers: noCacheHeaders });
    }

    const session = JSON.parse(sessionCookie.value);

    if (!session || !session.id) {
      return NextResponse.json({ authenticated: false }, { status: 200, headers: noCacheHeaders });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(session.id) },
      select: { id: true, name: true, email: true, avatar: true },
    });

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 200, headers: noCacheHeaders });
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || null,
        },
      },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (error) {
    console.error("Check User Session Error:", error);
    return NextResponse.json({ authenticated: false }, { status: 200, headers: noCacheHeaders });
  }
}

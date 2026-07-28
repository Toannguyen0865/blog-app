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

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: session.id,
          name: session.name,
          email: session.email,
          avatar: session.avatar || null,
        },
      },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (error) {
    console.error("Check User Session Error:", error);
    return NextResponse.json({ authenticated: false }, { status: 200, headers: noCacheHeaders });
  }
}

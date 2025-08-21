import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const authUser = await getSessionUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ user: authUser });
  } catch (error) {
    console.error("/api/me error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authUser = await getSessionUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const walletAddress: string | undefined = body?.walletAddress;

    const dbUser = await prisma.user.update({
      where: { id: authUser.id },
      data: { walletAddress: walletAddress ?? undefined },
    });

    return NextResponse.json({ user: dbUser });
  } catch (error) {
    console.error("/api/me POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}



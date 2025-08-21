import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@civic/auth-web3/nextjs";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
    });
    return NextResponse.json({ events });
  } catch (error) {
    console.error("/api/events GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authUser = await getUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, date, location } = await req.json();
    if (!title || !date) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const email = authUser.email;
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const organizer = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        organizerId: organizer.id,
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("/api/events POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}



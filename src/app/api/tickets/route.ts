import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const authUser = await getSessionUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const dbUser = await prisma.user.findUnique({ where: { id: authUser.id } });
    if (!dbUser) {
      return NextResponse.json({ tickets: [] });
    }

    const rsvps = await prisma.rSVP.findMany({
      where: { userId: dbUser.id },
      include: { event: true },
      orderBy: { createdAt: "desc" },
    });

    const tickets = rsvps.map((r) => ({
      id: r.id,
      eventId: r.eventId,
      eventTitle: r.event.title,
      eventDate: r.event.date,
      eventLocation: r.event.location,
      ticketToken: r.ticketToken,
      createdAt: r.createdAt,
    }));

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error("/api/tickets GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}



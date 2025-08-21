import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
	try {
		const organizer = await getSessionUser();
		if (!organizer) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { token, walletAddress } = await req.json();
		if (!token || !walletAddress) {
			return NextResponse.json({ error: "Missing fields" }, { status: 400 });
		}

		// Verify ticket token
		const secret = process.env.TICKET_SECRET as string;
		if (!secret) {
			return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
		}

		// Find RSVP by token (and wallet), and derive eventId if not provided
		const rsvp = await prisma.rSVP.findFirst({
			where: {
				ticketToken: token,
				walletAddress: walletAddress,
			},
			include: { user: true },
		});

		if (!rsvp) {
			return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
		}

		const eventId = rsvp.eventId;

		// Verify ticket token with resolved eventId
		const expected = crypto
			.createHmac("sha256", secret)
			.update(`${eventId}|${walletAddress}`)
			.digest("hex");

		if (token !== expected) {
			return NextResponse.json({ error: "Invalid ticket" }, { status: 400 });
		}

		// Check if already checked in
		const existingCheckIn = await prisma.checkIn.findUnique({
			where: {
				userId_eventId: {
					userId: rsvp.userId,
					eventId: eventId,
				},
			},
		});

		if (existingCheckIn) {
			return NextResponse.json({ error: "Already checked in" }, { status: 400 });
		}

		// Create check-in record
		await prisma.checkIn.create({
			data: {
				userId: rsvp.userId,
				eventId: eventId,
				walletAddress: walletAddress,
			},
		});

		return NextResponse.json({
			success: true,
			message: "Check-in successful",
			attendee: {
				name: rsvp.user.email,
				walletAddress: walletAddress,
			},
		});
	} catch (error) {
		console.error("Check-in error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}



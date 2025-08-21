import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
	try {
		const user = await getSessionUser();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { eventId, walletAddress } = await req.json();
		if (!eventId || !walletAddress) {
			return NextResponse.json({ error: "Missing fields" }, { status: 400 });
		}

		// Use current session user
		const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
		if (!dbUser) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Check if already RSVP'd
		const existingRSVP = await prisma.rSVP.findUnique({
			where: {
				userId_eventId: {
					userId: dbUser.id,
					eventId: eventId,
				},
			},
		});

		if (existingRSVP) {
			return NextResponse.json({ error: "Already RSVP'd to this event" }, { status: 400 });
		}

		// Generate ticket token
		const secret = process.env.TICKET_SECRET as string;
		if (!secret) {
			return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
		}

		const token = crypto
			.createHmac("sha256", secret)
			.update(`${eventId}|${walletAddress}`)
			.digest("hex");

		// Save RSVP to database
		const rsvp = await prisma.rSVP.create({
			data: {
				userId: dbUser.id,
				eventId: eventId,
				walletAddress: walletAddress,
				ticketToken: token,
			},
		});

		return NextResponse.json({
			success: true,
			ticketUrl: `/ticket/${token}`,
			token: token,
			rsvpId: rsvp.id,
		});
	} catch (error) {
		console.error("RSVP error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}



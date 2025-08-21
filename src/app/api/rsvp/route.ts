import { NextResponse } from "next/server";
import { getUser } from "@civic/auth-web3/nextjs";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
	try {
		const user = await getUser();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { eventId, walletAddress } = await req.json();
		if (!eventId || !walletAddress) {
			return NextResponse.json({ error: "Missing fields" }, { status: 400 });
		}

		// Check if user already exists in database, create if not
		let dbUser = await prisma.user.findUnique({
			where: { email: user.email },
		});

		if (!dbUser) {
			dbUser = await prisma.user.create({
				data: {
					email: user.email,
					walletAddress: walletAddress,
				},
			});
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



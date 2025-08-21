"use client";

import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import QRCode from "react-qr-code";
import { useState } from "react";

export default function EventPage() {
	const params = useParams<{ id: string }>();
	const { address } = useAccount();
	const [token, setToken] = useState<string | null>(null);

	async function rsvp() {
		if (!address) return;
		const res = await fetch("/api/rsvp", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ eventId: params.id, walletAddress: address }),
		});
		const data = await res.json();
		setToken(data.token);
	}

	return (
		<div className="p-8 space-y-4">
			<h1 className="text-xl font-semibold">Event {params.id}</h1>
			<button className="px-4 py-2 rounded bg-black text-white" onClick={rsvp}>
				RSVP
			</button>
			{token && (
				<div className="space-y-2">
					<p>Your ticket QR:</p>
					<QRCode value={`${location.origin}/t/${token}`} />
				</div>
			)}
		</div>
	);
}



"use client";

import { useParams } from "next/navigation";
import QRCode from "react-qr-code";
import Link from "next/link";

export default function TicketPage() {
	const params = useParams<{ token: string }>();
	const token = params.token;

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="container mx-auto px-4 py-8">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Your Ticket</h1>
					<Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">← Home</Link>
				</div>
				<div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 text-center">
					<div className="mb-4">
						<div className="bg-gray-50 rounded-lg p-4 inline-block">
							<QRCode value={typeof window !== "undefined" ? window.location.href : String(token)} size={180} level="M" />
						</div>
					</div>
					<p className="text-sm text-gray-600 break-all">Token: {token}</p>
					<p className="text-xs text-gray-500 mt-2">Keep this page open to present at check-in.</p>
				</div>
			</div>
		</div>
	);
}



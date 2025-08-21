"use client";

import { useUser } from "@civic/auth-web3/react";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import Link from "next/link";
import { UserButton } from "@civic/auth-web3/react";
import QRCode from "react-qr-code";

interface Ticket {
	id: string;
	eventId: string;
	eventTitle: string;
	eventDate: string;
	eventLocation: string;
	ticketToken: string;
	createdAt: string;
}

export default function MyTicketsPage() {
	const { user } = useUser();
	const { address } = useAccount();
	const [tickets, setTickets] = useState<Ticket[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!user) return;
		const fetchTickets = async () => {
			try {
				const res = await fetch("/api/tickets");
				const data = await res.json();
				setTickets(data.tickets || []);
			} catch (e) {
				setTickets([]);
			} finally {
				setLoading(false);
			}
		};
		fetchTickets();
	}, [user]);

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	if (!user) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-semibold text-gray-700 mb-4">
						Please sign in to view your tickets
					</h1>
					<UserButton />
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="flex justify-between items-center mb-8">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
						<p className="text-gray-600 mt-2">Your RSVPs and QR codes</p>
					</div>
					<div className="flex items-center space-x-4">
						<Link
							href="/"
							className="text-blue-600 hover:text-blue-800 font-medium"
						>
							← Back to Home
						</Link>
						<UserButton />
					</div>
				</div>

				{/* Content */}
				<div className="max-w-4xl mx-auto">
					{loading ? (
						<div className="text-center py-12">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
							<p className="mt-4 text-gray-600">Loading your tickets...</p>
						</div>
					) : tickets.length === 0 ? (
						<div className="text-center py-12">
							<div className="text-6xl mb-4">🎫</div>
							<h2 className="text-2xl font-semibold text-gray-700 mb-4">
								No tickets yet
							</h2>
							<p className="text-gray-600 mb-8">
								RSVP to events to see your tickets here
							</p>
							<Link
								href="/events"
								className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
							>
								Browse Events
							</Link>
						</div>
					) : (
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{tickets.map((ticket) => (
								<div key={ticket.id} className="bg-white rounded-lg shadow-md p-6">
									<div className="flex justify-between items-start mb-4">
										<div>
											<h3 className="text-xl font-semibold text-gray-900">
												{ticket.eventTitle}
											</h3>
											<p className="text-gray-600 text-sm">
												{formatDate(ticket.eventDate)}
											</p>
										</div>
										<div className="text-right">
											<span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
												Confirmed
											</span>
										</div>
									</div>

									<div className="space-y-2 mb-6">
										<div className="flex items-center text-sm text-gray-500">
											<span className="mr-2">📍</span>
											{ticket.eventLocation}
										</div>
										<div className="flex items-center text-sm text-gray-500">
											<span className="mr-2">🎫</span>
											Ticket #{ticket.id}
										</div>
									</div>

									{/* QR Code */}
									<div className="text-center">
										<div className="bg-gray-50 rounded-lg p-4 inline-block">
											<QRCode
												value={`${window.location.origin}/ticket/${ticket.ticketToken}`}
												size={150}
												level="M"
											/>
										</div>
										<p className="text-xs text-gray-500 mt-2">
											Show this QR code at the event entrance
										</p>
									</div>

									<div className="mt-6 pt-4 border-t border-gray-200">
										<div className="flex justify-between text-sm text-gray-500">
											<span>RSVP'd on {formatDate(ticket.createdAt)}</span>
											<span>Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

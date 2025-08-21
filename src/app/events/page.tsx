"use client";

import { useUser } from "@civic/auth-web3/react";
import { useAccount } from "wagmi";
import { useState } from "react";
import Link from "next/link";
import { UserButton } from "@civic/auth-web3/react";

// Sample events data
const sampleEvents = [
	{
		id: "1",
		title: "Web3 Developer Meetup",
		description: "Join fellow developers for an evening of networking and technical discussions about the latest in Web3 development.",
		date: "2025-01-15T18:00:00Z",
		location: "Tech Hub Downtown",
		organizer: "Civic Labs",
		attendees: 45,
	},
	{
		id: "2",
		title: "Blockchain Conference 2025",
		description: "A comprehensive conference covering blockchain technology, DeFi, and the future of decentralized applications.",
		date: "2025-02-20T09:00:00Z",
		location: "Convention Center",
		organizer: "Blockchain Events Inc",
		attendees: 120,
	},
	{
		id: "3",
		title: "Crypto Art Exhibition",
		description: "Explore the intersection of art and blockchain technology with exclusive NFT exhibitions and artist talks.",
		date: "2025-01-30T14:00:00Z",
		location: "Modern Art Gallery",
		organizer: "Digital Art Collective",
		attendees: 78,
	},
];

export default function EventsPage() {
	const { user } = useUser();
	const { address } = useAccount();
	const [rsvpStatus, setRsvpStatus] = useState<Record<string, string>>({});

	const handleRSVP = async (eventId: string) => {
		if (!address) return;

		setRsvpStatus(prev => ({ ...prev, [eventId]: "loading" }));

		try {
			const response = await fetch("/api/rsvp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ eventId, walletAddress: address }),
			});

			if (response.ok) {
				setRsvpStatus(prev => ({ ...prev, [eventId]: "success" }));
			} else {
				setRsvpStatus(prev => ({ ...prev, [eventId]: "error" }));
			}
		} catch (error) {
			setRsvpStatus(prev => ({ ...prev, [eventId]: "error" }));
		}
	};

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
						Please sign in to view events
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
						<h1 className="text-3xl font-bold text-gray-900">Events</h1>
						<p className="text-gray-600 mt-2">Discover and RSVP to upcoming events</p>
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

				{/* Events Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{sampleEvents.map((event) => (
						<div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
							<div className="p-6">
								<h3 className="text-xl font-semibold text-gray-900 mb-2">
									{event.title}
								</h3>
								<p className="text-gray-600 text-sm mb-4">
									{event.description}
								</p>
								
								<div className="space-y-2 mb-4">
									<div className="flex items-center text-sm text-gray-500">
										<span className="mr-2">📅</span>
										{formatDate(event.date)}
									</div>
									<div className="flex items-center text-sm text-gray-500">
										<span className="mr-2">📍</span>
										{event.location}
									</div>
									<div className="flex items-center text-sm text-gray-500">
										<span className="mr-2">👥</span>
										{event.attendees} attendees
									</div>
								</div>

								<div className="flex space-x-3">
									<button
										onClick={() => handleRSVP(event.id)}
										disabled={rsvpStatus[event.id] === "loading"}
										className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
											rsvpStatus[event.id] === "success"
												? "bg-green-100 text-green-800"
												: rsvpStatus[event.id] === "error"
												? "bg-red-100 text-red-800"
												: "bg-blue-600 text-white hover:bg-blue-700"
										}`}
									>
										{rsvpStatus[event.id] === "loading"
											? "RSVPing..."
											: rsvpStatus[event.id] === "success"
											? "✓ RSVP'd"
											: rsvpStatus[event.id] === "error"
											? "Error"
											: "RSVP"}
									</button>
									<Link
										href={`/event/${event.id}`}
										className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
									>
										View
									</Link>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

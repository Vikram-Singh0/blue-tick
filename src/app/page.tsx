"use client";

import { UserButton, useUser, useAutoConnect } from "@civic/auth-web3/react";
import { useAccount, useBalance } from "wagmi";
import Link from "next/link";

export default function Home() {
	const { user } = useUser();
	useAutoConnect();
	const { address } = useAccount();
	const { data: balance } = useBalance({ address });

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">🎟️ Ticketless</h1>
					<UserButton />
				</div>

				{/* Main Content */}
				<div className="max-w-4xl mx-auto">
					{!user ? (
						<div className="text-center py-12">
							<h2 className="text-2xl font-semibold text-gray-700 mb-4">
								Welcome to Ticketless Events
							</h2>
							<p className="text-gray-600 mb-8">
								Sign in with Civic to access events and manage your tickets
							</p>
						</div>
					) : (
						<div className="space-y-8">
							{/* User Info Card */}
							<div className="bg-white rounded-lg shadow-md p-6">
								<h2 className="text-xl font-semibold text-gray-900 mb-4">
									Welcome back, {user.email}!
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<p className="text-sm text-gray-600">Wallet Address</p>
										<p className="font-mono text-sm bg-gray-100 p-2 rounded">
											{address || "Connecting..."}
										</p>
									</div>
									<div className="space-y-2">
										<p className="text-sm text-gray-600">Balance</p>
										<p className="font-semibold">
											{balance ? `${balance.formatted} ${balance.symbol}` : "Loading..."}
										</p>
									</div>
								</div>
							</div>

							{/* Quick Actions */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<Link
									href="/events"
									className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
								>
									<div className="text-center">
										<div className="text-3xl mb-2">📅</div>
										<h3 className="font-semibold text-gray-900">Browse Events</h3>
										<p className="text-sm text-gray-600 mt-2">
											Find and RSVP to upcoming events
										</p>
									</div>
								</Link>

								<Link
									href="/my-tickets"
									className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
								>
									<div className="text-center">
										<div className="text-3xl mb-2">🎫</div>
										<h3 className="font-semibold text-gray-900">My Tickets</h3>
										<p className="text-sm text-gray-600 mt-2">
											View your RSVPs and QR codes
										</p>
									</div>
								</Link>

								<Link
									href="/scan"
									className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
								>
									<div className="text-center">
										<div className="text-3xl mb-2">📱</div>
										<h3 className="font-semibold text-gray-900">Scan Tickets</h3>
										<p className="text-sm text-gray-600 mt-2">
											Organizer check-in tool
										</p>
									</div>
								</Link>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

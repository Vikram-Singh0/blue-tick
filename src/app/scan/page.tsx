"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import { useAccount } from "wagmi";
import { useUser } from "@civic/auth-web3/react";
import Link from "next/link";
import { UserButton } from "@civic/auth-web3/react";

export default function ScanPage() {
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const [decoded, setDecoded] = useState<string | null>(null);
	const [scanning, setScanning] = useState(false);
	const [checkInStatus, setCheckInStatus] = useState<string>("");
	const { address } = useAccount();
	const { user } = useUser();

	useEffect(() => {
		if (!user) return;

		const codeReader = new BrowserQRCodeReader();
		let stop = false;

		const startScanning = async () => {
			try {
				setScanning(true);
				const controls = await codeReader.decodeFromVideoDevice(
					undefined,
					videoRef.current!,
					(result) => {
						if (result && !stop) {
							setDecoded(result.getText());
							setScanning(false);
							stop = true;
							controls.stop();
						}
					}
				);

				return () => {
					stop = true;
					controls.stop();
				};
			} catch (error) {
				console.error("Error starting scanner:", error);
				setScanning(false);
			}
		};

		startScanning();

		return () => {
			stop = true;
		};
	}, [user]);

	const handleCheckIn = async () => {
		if (!decoded || !address) return;

		setCheckInStatus("checking");

		try {
			const url = new URL(decoded);
			const token = url.pathname.split("/ticket/")[1];

			const response = await fetch("/api/checkin", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token, walletAddress: address }),
			});

			if (response.ok) {
				setCheckInStatus("success");
			} else {
				setCheckInStatus("error");
			}
		} catch (error) {
			setCheckInStatus("error");
		}
	};

	const resetScan = () => {
		setDecoded(null);
		setCheckInStatus("");
		setScanning(true);
		// Restart scanning logic here
	};

	if (!user) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-semibold text-gray-700 mb-4">
						Please sign in to access scanner
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
						<h1 className="text-3xl font-bold text-gray-900">Scan Tickets</h1>
						<p className="text-gray-600 mt-2">Organizer check-in tool</p>
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

				<div className="max-w-2xl mx-auto">
					{/* Scanner Section */}
					<div className="bg-white rounded-lg shadow-md p-6 mb-6">
						<h2 className="text-xl font-semibold text-gray-900 mb-4">
							QR Code Scanner
						</h2>
						
						{!decoded ? (
							<div className="space-y-4">
								<div className="relative">
									<video
										ref={videoRef}
										className="w-full max-w-md mx-auto bg-black rounded-lg"
										style={{ height: "300px" }}
									/>
									{scanning && (
										<div className="absolute inset-0 flex items-center justify-center">
											<div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded">
												Scanning...
											</div>
										</div>
									)}
								</div>
								<p className="text-sm text-gray-600 text-center">
									Point your camera at a ticket QR code
								</p>
							</div>
						) : (
							<div className="space-y-4">
								<div className="bg-gray-50 rounded-lg p-4">
									<h3 className="font-semibold text-gray-900 mb-2">
										Scanned Ticket
									</h3>
									<p className="text-sm text-gray-600 break-all">{decoded}</p>
								</div>

								{checkInStatus === "" && (
									<button
										onClick={handleCheckIn}
										className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
									>
										Confirm Check-in
									</button>
								)}

								{checkInStatus === "checking" && (
									<div className="text-center py-4">
										<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
										<p className="mt-2 text-gray-600">Processing check-in...</p>
									</div>
								)}

								{checkInStatus === "success" && (
									<div className="bg-green-50 border border-green-200 rounded-lg p-4">
										<div className="flex items-center">
											<div className="text-green-600 text-xl mr-2">✓</div>
											<div>
												<h3 className="font-semibold text-green-800">
													Check-in Successful!
												</h3>
												<p className="text-green-700 text-sm">
													The attendee has been checked in.
												</p>
											</div>
										</div>
									</div>
								)}

								{checkInStatus === "error" && (
									<div className="bg-red-50 border border-red-200 rounded-lg p-4">
										<div className="flex items-center">
											<div className="text-red-600 text-xl mr-2">✗</div>
											<div>
												<h3 className="font-semibold text-red-800">
													Check-in Failed
												</h3>
												<p className="text-red-700 text-sm">
													Invalid ticket or already checked in.
												</p>
											</div>
										</div>
									</div>
								)}

								<button
									onClick={resetScan}
									className="w-full bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition-colors"
								>
									Scan Another Ticket
								</button>
							</div>
						)}
					</div>

					{/* Instructions */}
					<div className="bg-blue-50 rounded-lg p-4">
						<h3 className="font-semibold text-blue-900 mb-2">
							How to use the scanner:
						</h3>
						<ol className="text-sm text-blue-800 space-y-1">
							<li>1. Allow camera access when prompted</li>
							<li>2. Point camera at the attendee's QR code</li>
							<li>3. Wait for the code to be detected</li>
							<li>4. Confirm the check-in</li>
						</ol>
					</div>
				</div>
			</div>
		</div>
	);
}



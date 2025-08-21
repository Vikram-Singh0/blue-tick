"use client";

import { CivicAuthProvider } from "@civic/auth-web3/react";
import { WagmiWrapper } from "@/lib/wagmi";
import { useEffect } from "react";
import { useUser } from "@civic/auth-web3/react";
import { useAccount } from "wagmi";

export default function Providers({ children }: { children: React.ReactNode }) {
	const clientId = process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID as string;
	return (
		<WagmiWrapper>
			<CivicAuthProvider clientId={clientId}>
				<UserBootstrapper />
				{children}
			</CivicAuthProvider>
		</WagmiWrapper>
	);
}


function UserBootstrapper() {
	const { address } = useAccount();

	useEffect(() => {
		if (!address) return;
		fetch("/api/me", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ walletAddress: address }),
		});
	}, [address]);

	return null;
}



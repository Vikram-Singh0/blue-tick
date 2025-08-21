"use client";

import { CivicAuthProvider } from "@civic/auth-web3/react";
import { WagmiWrapper } from "@/lib/wagmi";

export default function Providers({ children }: { children: React.ReactNode }) {
	const clientId = process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID as string;
	return (
		<WagmiWrapper>
			<CivicAuthProvider clientId={clientId}>{children}</CivicAuthProvider>
		</WagmiWrapper>
	);
}



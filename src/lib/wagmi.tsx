"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet } from "viem/chains";
import { embeddedWallet } from "@civic/auth-web3";
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const wagmiConfig = createConfig({
	chains: [mainnet],
	transports: {
		[mainnet.id]: http(),
	},
	connectors: [embeddedWallet()],
});

export function WagmiWrapper({ children }: { children: ReactNode }) {
	const queryClient = new QueryClient();
	return (
		<QueryClientProvider client={queryClient}>
			<WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
		</QueryClientProvider>
	);
}



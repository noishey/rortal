'use client'; // Enable client-side rendering for this component

import { WagmiProvider, createConfig, http } from 'wagmi'; // Import Wagmi for Web3 functionality
import { polygonAmoy } from 'wagmi/chains'; // Import Polygon Amoy testnet configuration
import { injected } from 'wagmi/connectors'; // Import injected wallet connector (MetaMask)
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import React Query for data fetching

const config = createConfig({ // Create Wagmi configuration for Web3 connections
  chains: [polygonAmoy], // Support Polygon Amoy testnet only
  transports: { // Define RPC transports for each chain
    [polygonAmoy.id]: http(), // Use HTTP transport for Polygon Amoy
  },
  connectors: [ // Define wallet connectors
    injected({ // Injected wallet connector configuration
      target: 'metaMask', // Target MetaMask specifically
    }),
  ],
});

const queryClient = new QueryClient(); // Create React Query client for caching

export function Providers({ children }: { children: React.ReactNode }) { // Providers wrapper component
  return (
    <QueryClientProvider client={queryClient}> {/* Provide React Query client */}
      <WagmiProvider config={config}> {/* Provide Wagmi Web3 configuration */}
        {children} {/* Render child components */}
      </WagmiProvider>
    </QueryClientProvider>
  );
}
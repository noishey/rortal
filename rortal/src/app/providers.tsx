'use client';

import { WagmiConfig, createConfig } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';

const config = createConfig({
  chains: [polygonAmoy],
  transports: {
    [polygonAmoy.id]: publicProvider(),
  },
  connectors: [
    new InjectedConnector({
      chains: [polygonAmoy],
      options: {
        name: 'MetaMask',
        shimDisconnect: true,
      },
    }),
  ],
});

export function Providers({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
} 
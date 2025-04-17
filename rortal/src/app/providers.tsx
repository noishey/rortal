'use client';

import { WagmiConfig, createConfig } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { ThemeProvider } from 'next-themes';

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
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <WagmiConfig config={config}>
        {children}
      </WagmiConfig>
    </ThemeProvider>
  );
} 
'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

export default function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  const handleClick = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-6 py-2 text-sm font-medium text-white bg-black/80 backdrop-blur-sm rounded-full 
                hover:bg-black/90 transition-all duration-200 ease-in-out
                border border-white/10 shadow-lg"
    >
      {isConnected ? (
        <span>
          {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
        </span>
      ) : (
        'Wallets'
      )}
    </button>
  );
} 
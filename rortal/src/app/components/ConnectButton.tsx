'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected, coinbaseWallet } from 'wagmi/connectors';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);

  const walletOptions = [
    {
      name: 'MetaMask',
      connector: injected({ target: 'metaMask' }),
      icon: '🦊',
      type: 'wallet'
    },
    {
      name: 'Coinbase Wallet',
      connector: coinbaseWallet({ appName: 'Rortal', appLogoUrl: '/logo.png' }),
      icon: '🔵',
      type: 'wallet'
    },
    {
      name: 'Gmail',
      connector: null,
      icon: '📧',
      type: 'oauth'
    }
  ];

  const handleWalletConnect = (connector: any) => {
    connect({ connector });
    setShowModal(false);
  };

  const handleGmailLogin = () => {
    signIn('google');
    setShowModal(false);
  };

  const handleClick = () => {
    if (isConnected || session) {
      if (isConnected) disconnect();
      if (session) signOut();
    } else {
      setShowModal(true);
    }
  };

  const getDisplayText = () => {
    if (isConnected && address) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    if (session?.user?.email) {
      return session.user.email.split('@')[0];
    }
    return 'Connect';
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors flex items-center gap-2"
      >
        {session?.user?.image && (
          <img 
            src={session.user.image} 
            alt="Profile" 
            className="w-6 h-6 rounded-full"
          />
        )}
        {getDisplayText()}
      </button>

      {/* Connection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-semibold">Connect Account</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              {walletOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => {
                    if (option.type === 'wallet') {
                      handleWalletConnect(option.connector);
                    } else {
                      handleGmailLogin();
                    }
                  }}
                  className="w-full flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 transition-colors"
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="text-white font-medium">{option.name}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-gray-400 text-sm text-center">
                Choose Web3 wallet or traditional login
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
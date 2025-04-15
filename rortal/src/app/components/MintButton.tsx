"use client";
import { useState } from "react";
import { ethers } from "ethers";
import { useAccount, useConnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import BrowserMintNFT from "@/app/abi/BrowserMintNFT.json";

declare global {
  interface Window {
    ethereum: any;
  }
}

interface MintButtonProps {
  onMintSuccess: (tokenId: string) => void;
}

const POLYGON_AMOY_CHAIN_ID = 80002;
const CONTRACT_ADDRESS = "0xd9Aa3fAe83B41f4F9835fB7ab7d087f0c91419ED"; // Contract on Polygon Amoy

export default function MintButton({ onMintSuccess }: MintButtonProps) {
  const [isMinting, setIsMinting] = useState(false);
  const { isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const [error, setError] = useState<string | null>(null);

  const switchToPolygonAmoy = async (provider: ethers.providers.Web3Provider) => {
    try {
      console.log("Attempting to switch to Polygon Amoy...");
      await provider.send('wallet_switchEthereumChain', [{ chainId: `0x${POLYGON_AMOY_CHAIN_ID.toString(16)}` }]);
      console.log("Successfully switched to Polygon Amoy");
    } catch (switchError: unknown) {
      console.log("Error switching network:", switchError);
      if (typeof switchError === 'object' && switchError && 'code' in switchError && switchError.code === 4902) {
        try {
          console.log("Network not found, attempting to add Polygon Amoy...");
          await provider.send('wallet_addEthereumChain', [
            {
              chainId: `0x${POLYGON_AMOY_CHAIN_ID.toString(16)}`,
              chainName: 'Polygon Amoy Testnet',
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18
              },
              rpcUrls: ['https://rpc-amoy.polygon.technology'],
              blockExplorerUrls: ['https://www.oklink.com/amoy']
            }
          ]);
          console.log("Successfully added Polygon Amoy");
        } catch (addError) {
          console.error("Error adding network:", addError);
          throw new Error('Could not add Polygon Amoy network');
        }
      }
      throw new Error('Could not switch to Polygon Amoy network');
    }
  };

  const handleMint = async () => {
    if (!isConnected) {
      connect();
      return;
    }

    setIsMinting(true);
    setError(null);

    if (!window.ethereum) {
      setError("Please install MetaMask");
      setIsMinting(false);
      return;
    }

    try {
      console.log("Starting minting process...");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      console.log("Current network:", network);
      
      if (network.chainId !== POLYGON_AMOY_CHAIN_ID) {
        console.log("Wrong network, switching to Polygon Amoy...");
        await switchToPolygonAmoy(provider);
        // After switching networks, we need to get a new provider instance
        const updatedProvider = new ethers.providers.Web3Provider(window.ethereum);
        await updatedProvider.send("eth_requestAccounts", []);
        const signer = updatedProvider.getSigner();
        
        console.log("Getting contract instance...");
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          BrowserMintNFT.abi,
          signer
        );

        // Using a dummy IPFS URI for testing
        const tokenURI = "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";
        
        console.log("Minting NFT...");
        const mintTx = await contract.mintNFT(tokenURI);
        console.log("Mint transaction sent:", mintTx.hash);
        
        const receipt = await mintTx.wait();
        console.log("Full transaction receipt:", receipt);

        // Get the tokenId from the return value
        const tokenId = receipt.events?.[0]?.topics?.[3];
        if (!tokenId) {
          console.error("No token ID found in events:", receipt.events);
          throw new Error("Failed to get token ID from transaction");
        }

        // Convert from hex to decimal
        const tokenIdDecimal = ethers.BigNumber.from(tokenId).toString();
        console.log("Token ID:", tokenIdDecimal);
        onMintSuccess(tokenIdDecimal);
      } else {
        const signer = provider.getSigner();
        console.log("Getting contract instance...");
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          BrowserMintNFT.abi,
          signer
        );

        // Using a dummy IPFS URI for testing
        const tokenURI = "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";
        
        console.log("Minting NFT...");
        const mintTx = await contract.mintNFT(tokenURI);
        console.log("Mint transaction sent:", mintTx.hash);
        
        const receipt = await mintTx.wait();
        console.log("Full transaction receipt:", receipt);

        // Get the tokenId from the return value
        const tokenId = receipt.events?.[0]?.topics?.[3];
        if (!tokenId) {
          console.error("No token ID found in events:", receipt.events);
          throw new Error("Failed to get token ID from transaction");
        }

        // Convert from hex to decimal
        const tokenIdDecimal = ethers.BigNumber.from(tokenId).toString();
        console.log("Token ID:", tokenIdDecimal);
        onMintSuccess(tokenIdDecimal);
      }
    } catch (err) {
      console.error("Detailed minting error:", err);
      if (err instanceof Error) {
        if (err.message.includes("user rejected")) {
          setError("Transaction was rejected");
        } else {
          setError(err.message);
        }
      } else {
        setError("Failed to mint NFT");
      }
    } finally {
      setIsMinting(false);
    }
  };

  const handleCreateWallet = () => {
    window.open('https://metamask.io/download/', '_blank');
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        onClick={handleMint}
        disabled={isMinting}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {isMinting ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Minting...
          </>
        ) : isConnected ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M12 8v8"/>
              <path d="M8 12h8"/>
            </svg>
            Mint NFT
          </>
        ) : (
          "Connect Wallet"
        )}
      </button>

      <button
        onClick={handleCreateWallet}
        className="text-blue-500 hover:text-blue-600 text-sm underline"
      >
        Don&apos;t have a wallet?
      </button>

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}

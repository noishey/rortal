"use client";
import { useState } from "react";
import { ethers } from "ethers";
import BrowserMintNFT from "@/app/abi/BrowserMintNFT.json";

declare global {
  interface Window {
    ethereum: ethers.Eip1193Provider;
  }
}

interface MintButtonProps {
  onMintSuccess: (tokenId: string) => void;
}

export default function MintButton({ onMintSuccess }: MintButtonProps) {
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMint = async () => {
    setIsMinting(true);
    setError(null);

    if (!window.ethereum) {
      setError("Please install MetaMask");
      setIsMinting(false);
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      
      if (network.chainId !== 11155111) { // Sepolia
        setError("Please switch to Sepolia network");
        setIsMinting(false);
        return;
      }

      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0xd9Aa3fAe83B41f4F9835fB7ab7d087f0c91419ED",
        BrowserMintNFT.abi,
        signer
      );

      // Using a dummy IPFS URI for testing
      const tokenURI = "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";
      
      const tx = await contract.mintNFT(tokenURI);
      console.log("Transaction sent:", tx.hash);
      
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);
      
      const tokenId = receipt.events[0].args.tokenId.toString();
      onMintSuccess(tokenId);
    } catch (err) {
      console.error("Minting error:", err);
      setError(err instanceof Error ? err.message : "Failed to mint NFT");
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        onClick={handleMint}
        disabled={isMinting}
        className="p-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isMinting ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Minting...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M12 8v8"/>
              <path d="M8 12h8"/>
            </svg>
            Mint NFT
          </>
        )}
      </button>

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}

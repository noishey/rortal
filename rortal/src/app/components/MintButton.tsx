"use client";
import { useState } from "react";
import { ethers } from "ethers";
import BrowserMintNFT from "@/app/abi/BrowserMintNFT.json";

declare global {
  interface Window {
    ethereum: ethers.providers.ExternalProvider;
  }
}

interface MintButtonProps {
  onMintSuccess: (tokenId: string) => void;
}

export default function MintButton({ onMintSuccess }: MintButtonProps) {
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mintNFT = async () => {
    setMinting(true);
    setError(null);
    
    if (!window.ethereum) {
      setError("Please install MetaMask");
      setMinting(false);
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      
      if (network.chainId !== 11155111) { // Sepolia
        setError("Please switch to Sepolia network");
        setMinting(false);
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
      setError(err instanceof Error ? err.message : "Minting failed");
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={mintNFT}
        disabled={minting}
        className="p-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {minting ? "Minting..." : "Mint NFT"}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

"use client"

import { useState } from 'react';
import { ethers } from 'ethers';
import { Web3Storage } from 'web3.storage';

const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
const NFT_ABI = [
  "function mint(string memory tokenURI) public returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)"
];

export default function MintNFT({ imageUrl }: { imageUrl: string | null }) {
  const [isMinting, setIsMinting] = useState(false);
  const [mintedTokenId, setMintedTokenId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMint = async () => {
    if (!imageUrl) return;
    
    setIsMinting(true);
    setError(null);

    try {
      // 1. Upload to IPFS using Web3.Storage
      const client = new Web3Storage({ token: process.env.WEB3_STORAGE_TOKEN! });
      
      // Convert base64 to blob
      const base64Data = imageUrl.split(',')[1];
      const blob = await fetch(`data:image/png;base64,${base64Data}`).then(res => res.blob());
      
      // Create metadata
      const metadata = {
        name: "AI Generated Art",
        description: "Art generated using Stable Diffusion",
        image: imageUrl,
        attributes: []
      };

      // Upload to IPFS
      const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
      const cid = await client.put([new File([blob], 'image.png'), new File([metadataBlob], 'metadata.json')]);
      const tokenURI = `ipfs://${cid}/metadata.json`;

      // 2. Mint NFT on Sepolia
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS!, NFT_ABI, signer);

      const tx = await contract.mint(tokenURI);
      await tx.wait();

      // Get the token ID
      const receipt = await provider.getTransactionReceipt(tx.hash);
      const event = receipt.logs[0];
      const tokenId = parseInt(event.topics[3], 16);
      
      setMintedTokenId(tokenId.toString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mint NFT');
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <button
        onClick={handleMint}
        disabled={isMinting || !imageUrl || !!mintedTokenId}
        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isMinting ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Minting...
          </>
        ) : mintedTokenId ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Minted! Token ID: {mintedTokenId}
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
        <div className="text-destructive text-sm">
          {error}
        </div>
      )}
    </div>
  );
} 
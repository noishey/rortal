"use client" // Enable client-side rendering for Next.js component

import { useState } from 'react'; // Import React's state management hook
import { ethers } from 'ethers'; // Import ethers.js library for Ethereum interactions
import axios from 'axios'; // Import axios for making HTTP requests to Pinata

// NFT contract address from environment variables
const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
// Define the ABI (Application Binary Interface) with functions needed to interact with the NFT contract
const NFT_ABI = [
  "function mint(string memory tokenURI) public returns (uint256)", // Function signature for minting NFTs
  "function tokenURI(uint256 tokenId) public view returns (string memory)" // Function signature for retrieving NFT metadata
];

// Main MintNFT component - accepts imageUrl prop which contains the image to be minted
export default function MintNFT({ imageUrl }: { imageUrl: string | null }) {
  const [isMinting, setIsMinting] = useState(false); // State to track minting process
  const [mintedTokenId, setMintedTokenId] = useState<string | null>(null); // State to store minted token ID
  const [error, setError] = useState<string | null>(null); // State to store error messages

  // Function to handle the NFT minting process
  const handleMint = async () => {
    if (!imageUrl) return; // Exit if no image URL is provided
    
    setIsMinting(true); // Set minting state to true (for UI updates)
    setError(null); // Clear any previous errors

    try {
      // 1. Upload to IPFS using Pinata
      // Convert base64 data URL to blob for IPFS upload
      const base64Data = imageUrl.split(',')[1]; // Extract base64 data from data URL
      const blob = await fetch(`data:image/png;base64,${base64Data}`).then(res => res.blob()); // Convert to blob
      
      // Create NFT metadata object according to NFT standards
      const metadata = {
        name: "AI Generated Art", // Name of the NFT
        description: "Art generated using Stable Diffusion", // Description of the NFT
        image: "IMAGE_PLACEHOLDER", // Will be updated with IPFS URL
        attributes: [] // Additional attributes (empty in this case)
      };

      // Upload image to IPFS via Pinata
      const imageFile = new File([blob], 'image.png', { type: 'image/png' });
      const imageFormData = new FormData();
      imageFormData.append('file', imageFile);
      
      // Check for Pinata JWT token
      if (!process.env.NEXT_PUBLIC_PINATA_JWT) {
        throw new Error('Pinata JWT token not configured');
      }
      
      // Upload image
      const imageResponse = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', 
        imageFormData,
        {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      // Get image IPFS hash
      const imageHash = imageResponse.data.IpfsHash;
      
      // Update metadata with IPFS image URL
      metadata.image = `ipfs://${imageHash}`;
      
      // Upload metadata to IPFS
      const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
      const metadataFile = new File([metadataBlob], 'metadata.json', { type: 'application/json' });
      const metadataFormData = new FormData();
      metadataFormData.append('file', metadataFile);
      
      // Upload metadata
      const metadataResponse = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', 
        metadataFormData,
        {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      // Get metadata IPFS hash
      const metadataHash = metadataResponse.data.IpfsHash;
      const tokenURI = `ipfs://${metadataHash}`;
      
      // 2. Mint NFT on Sepolia testnet
      const provider = new ethers.providers.Web3Provider(window.ethereum); // Connect to MetaMask or other web3 provider
      const signer = await provider.getSigner(); // Get the signer (user's wallet)
      const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS!, NFT_ABI, signer); // Create contract instance

      const tx = await contract.mint(tokenURI); // Call mint function on the contract with the tokenURI
      await tx.wait(); // Wait for transaction to be confirmed

      // Get the token ID from transaction receipt
      const receipt = await provider.getTransactionReceipt(tx.hash); // Get transaction receipt
      const event = receipt.logs[0]; // Get first event log
      const tokenId = parseInt(event.topics[3], 16); // Parse token ID from event data (convert from hex)
      
      setMintedTokenId(tokenId.toString()); // Save token ID to state
    } catch (err) {
      // Handle errors by setting error message state
      setError(err instanceof Error ? err.message : 'Failed to mint NFT');
    } finally {
      setIsMinting(false); // Reset minting state regardless of outcome
    }
  };

  // Component UI rendering
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <button
        onClick={handleMint} // Call mint function when button is clicked
        disabled={isMinting || !imageUrl || !!mintedTokenId} // Disable button when minting, no image, or already minted
        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isMinting ? (
          // Show loading spinner and text when minting
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Minting...
          </>
        ) : mintedTokenId ? (
          // Show success message with token ID when minted
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Minted! Token ID: {mintedTokenId}
          </>
        ) : (
          // Show mint button when ready to mint
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
        // Display error message if there is one
        <div className="text-destructive text-sm">
          {error}
        </div>
      )}
    </div>
  );
} 
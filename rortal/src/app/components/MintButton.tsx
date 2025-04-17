"use client";
import { useState } from "react";
import { ethers } from "ethers";
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import BrowserMintNFT from "@/app/abi/BrowserMintNFT.json";
import { polygonAmoy } from 'wagmi/chains';

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
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const [isMinting, setIsMinting] = useState(false);
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

    try {
      // Step 1: Generate image with Stable Horde
      const response = await fetch('https://stablehorde.net/api/v2/generate/async', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': '0000000000',
        },
        body: JSON.stringify({
          prompt: "a beautiful fantasy landscape with mountains and a river",
          params: {
            n: 1,
            width: 512,
            height: 512,
            steps: 20,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const { id } = await response.json();

      // Step 2: Check generation status
      let imageUrl;
      let attempts = 0;
      const maxAttempts = 30;

      while (attempts < maxAttempts) {
        console.log(`Checking generation status (attempt ${attempts + 1}/${maxAttempts})...`);
        const statusResponse = await fetch(`https://stablehorde.net/api/v2/generate/check/${id}`);
        const statusData = await statusResponse.json();
        console.log('Generation status:', statusData);

        if (statusData.done) {
          const resultResponse = await fetch(`https://stablehorde.net/api/v2/generate/status/${id}`);
          const resultData = await resultResponse.json();
          console.log('Generation result:', resultData);
          imageUrl = resultData.generations[0].img;
          console.log('Generated image URL:', imageUrl);
          break;
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
        attempts++;
      }

      if (!imageUrl) {
        throw new Error('Image generation timed out');
      }

      // Step 3: Save image locally first
      console.log('Fetching generated image...');
      const imageResponse = await fetch(imageUrl);
      const blob = await imageResponse.blob();
      console.log('Image blob size:', blob.size);
      const fileName = `nft_${Date.now()}.png`;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Step 4: Upload to IPFS
      console.log('Uploading to IPFS...');
      const formData = new FormData();
      formData.append('file', blob);

      console.log('Pinata JWT:', process.env.NEXT_PUBLIC_PINATA_JWT ? 'Present' : 'Missing');
      
      const ipfsResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
        body: formData,
      });

      if (!ipfsResponse.ok) {
        const errorText = await ipfsResponse.text();
        console.error('IPFS upload failed:', errorText);
        throw new Error(`Failed to upload to IPFS: ${errorText}`);
      }

      const ipfsResult = await ipfsResponse.json();
      console.log('IPFS upload result:', ipfsResult);
      const { IpfsHash } = ipfsResult;
      const tokenURI = `ipfs://${IpfsHash}`;
      console.log('Final tokenURI:', tokenURI);

      // Step 5: Mint NFT
      if (!window.ethereum) {
        throw new Error("Please install MetaMask");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      
      if (network.chainId !== POLYGON_AMOY_CHAIN_ID) {
        await switchToPolygonAmoy(provider);
        // After switching networks, we need to get a new provider instance
        const updatedProvider = new ethers.providers.Web3Provider(window.ethereum);
        await updatedProvider.send("eth_requestAccounts", []);
        const signer = updatedProvider.getSigner();
        
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          BrowserMintNFT.abi,
          signer
        );

        console.log("Minting NFT with tokenURI:", tokenURI);
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
        // If already on Polygon Amoy
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          BrowserMintNFT.abi,
          signer
        );

        console.log("Minting NFT with tokenURI:", tokenURI);
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
        setError(err.message);
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
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 w-full"
      >
        {isMinting ? (
          <>
            <svg className="animate-spin h-5 w-5 inline mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Minting...
          </>
        ) : isConnected ? (
          "Mint NFT"
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

"use client";
import { useState } from "react";
import { ethers } from "ethers";
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import BrowserMintNFT from "@/app/abi/BrowserMintNFT.json";
import { polygonAmoy } from 'wagmi/chains';
import NFTViewer from './NFTViewer';

declare global {
  interface Window {
    ethereum: any;
  }
}

interface MintButtonProps {
  onSuccessTokenId?: string;
  setTokenId?: (tokenId: string) => void;
}

const POLYGON_AMOY_CHAIN_ID = 80002;
const CONTRACT_ADDRESS = "0xd9Aa3fAe83B41f4F9835fB7ab7d087f0c91419ED"; // Contract on Polygon Amoy

export default function MintButton({ onSuccessTokenId, setTokenId }: MintButtonProps) {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const [mintedTokenId, setMintedTokenId] = useState<string | null>(null);

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
      // Step 1: Generate image using our improved API endpoint with retry logic
      console.log('Generating image through local API...');
      let response;
      let retries = 0;
      const maxRetries = 3;
      
      while (retries < maxRetries) {
        try {
          response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt: "a beautiful fantasy landscape with mountains and a river, high quality, detailed",
              negative_prompt: "ugly, blurry, low quality",
              steps: 20,
              cfg_scale: 7.0,
              width: 512,
              height: 512,
              sampler_name: "k_euler_a"
            }),
          });
          
          // If successful, break out of retry loop
          if (response.ok) break;
          
          console.log(`API request failed (attempt ${retries + 1}/${maxRetries}), status: ${response.status}`);
        } catch (fetchError) {
          console.error(`Network error during API request (attempt ${retries + 1}/${maxRetries}):`, fetchError);
        }
        
        retries++;
        if (retries < maxRetries) {
          // Wait before retrying (exponential backoff)
          const waitTime = Math.min(1000 * Math.pow(2, retries), 8000);
          console.log(`Retrying in ${waitTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }

      if (!response || !response.ok) {
        const errorMessage = response ? await response.text().catch(() => 'Unknown error') : 'Network request failed';
        throw new Error(`Failed to generate image after ${maxRetries} attempts: ${errorMessage}`);
      }

      const responseData = await response.json().catch(() => {
        throw new Error('Failed to parse API response as JSON');
      });
      
      if (!responseData.image) {
        throw new Error('API response missing image data');
      }

      const imageUrl = `data:image/png;base64,${responseData.image}`;
      console.log('Generated image successfully');

      // Step 3: Process the generated image
      console.log('Processing generated image...');
      let blob;
      try {
        blob = await fetch(imageUrl).then(r => r.blob());
        console.log('Image blob size:', blob.size);
        
        if (blob.size === 0) {
          throw new Error('Generated image is empty');
        }
      } catch (blobError) {
        console.error('Error processing image blob:', blobError);
        throw new Error('Failed to process the generated image');
      }

      // Step 4: Upload to IPFS with improved error handling
      console.log('Uploading to IPFS...');
      const formData = new FormData();
      formData.append('file', blob);

      // Check for Pinata JWT token
      if (!process.env.NEXT_PUBLIC_PINATA_JWT) {
        throw new Error('Pinata JWT token not configured');
      }
      
      console.log('Starting IPFS upload...');
      
      // Use AbortController to set a timeout for the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      try {
        // Retry IPFS upload if needed
        let ipfsResponse;
        retries = 0;
        
        while (retries < maxRetries) {
          try {
            ipfsResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
              },
              body: formData,
              signal: controller.signal
            });
            
            // If successful, break out of retry loop
            if (ipfsResponse.ok) break;
            
            console.log(`IPFS upload failed (attempt ${retries + 1}/${maxRetries}), status: ${ipfsResponse.status}`);
          } catch (fetchError) {
            if (fetchError instanceof Error && fetchError.name === 'AbortError') {
              throw new Error('IPFS upload timed out after 30 seconds');
            }
            console.error(`Network error during IPFS upload (attempt ${retries + 1}/${maxRetries}):`, fetchError);
          }
          
          retries++;
          if (retries < maxRetries) {
            // Wait before retrying (exponential backoff)
            const waitTime = Math.min(2000 * Math.pow(2, retries), 8000);
            console.log(`Retrying IPFS upload in ${waitTime}ms...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
          }
        }
        
        // Clear the timeout since the request completed
        clearTimeout(timeoutId);

        if (!ipfsResponse || !ipfsResponse.ok) {
          const errorText = ipfsResponse ? await ipfsResponse.text().catch(() => 'Unknown error') : 'Network request failed';
          throw new Error(`Failed to upload to IPFS after ${maxRetries} attempts: ${errorText}`);
        }

        const ipfsResult = await ipfsResponse.json().catch(() => {
          throw new Error('Failed to parse IPFS response as JSON');
        });
        
        console.log('IPFS upload successful:', ipfsResult);
        const { IpfsHash } = ipfsResult;
        
        if (!IpfsHash) {
          throw new Error('IPFS response missing hash');
        }
        
        // Store the IPFS hash
        setIpfsHash(IpfsHash);
        
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
          setMintedTokenId(tokenIdDecimal);
          // Only call setTokenId if provided
          if (setTokenId) {
            setTokenId(tokenIdDecimal);
          }
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
          setMintedTokenId(tokenIdDecimal);
          // Only call setTokenId if provided
          if (setTokenId) {
            setTokenId(tokenIdDecimal);
          }
        }
      } catch (unknownError) {
        // Properly handle error with type checking
        if (unknownError instanceof Error && unknownError.name === 'AbortError') {
          throw new Error('IPFS upload timed out after 30 seconds');
        }
        throw unknownError;
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
    <div className="flex flex-col items-center gap-6 w-full">
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

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* NFT Viewer shows IPFS and blockchain information */}
      {ipfsHash && <NFTViewer ipfsHash={ipfsHash} tokenId={mintedTokenId} />}

      <button
        onClick={handleCreateWallet}
        className="text-blue-500 hover:text-blue-600 text-sm underline"
      >
        Don&apos;t have a wallet?
      </button>
    </div>
  );
}

"use client"; // Enable client-side functionality in Next.js
import { useState } from "react"; // Import useState hook for component state management
import { ethers } from "ethers"; // Import ethers library for blockchain interactions
import { useAccount, useConnect, useDisconnect } from 'wagmi'; // Import wagmi hooks for wallet connection
import { injected } from 'wagmi/connectors'; // Import connector for browser wallets like MetaMask
import BrowserMintNFT from "@/app/abi/BrowserMintNFT.json"; // Import ABI for the NFT contract
import { polygonAmoy } from 'wagmi/chains'; // Import Polygon Amoy chain configuration
import NFTViewer from './NFTViewer'; // Import NFT viewer component

// Extend Window interface to include ethereum property for MetaMask
declare global {
  interface Window {
    ethereum?: any; // Define optional ethereum property on Window interface
  }
}

// Define props interface for the MintButton component
interface MintButtonProps {
  onSuccessTokenId?: string; // Optional prop for token ID after successful mint
  setTokenId?: (tokenId: string) => void; // Optional callback to set token ID
  setMintedTokenId?: (tokenId: string) => void; // Optional callback to set minted token ID
  imageUrl?: string | null; // Optional prop for pre-generated image URL
}

const POLYGON_AMOY_CHAIN_ID = 80002; // Define Polygon Amoy testnet chain ID
const CONTRACT_ADDRESS = "0xd9Aa3fAe83B41f4F9835fB7ab7d087f0c91419ED"; // NFT contract address on Polygon Amoy

export default function MintButton({ onSuccessTokenId, setTokenId, imageUrl: providedImageUrl }: MintButtonProps) {
  const { address, isConnected } = useAccount(); // Get wallet connection status and address
  const { connect } = useConnect(); // Get connect function from wagmi
  const [isMinting, setIsMinting] = useState(false); // Track minting status
  const [error, setError] = useState<string | null>(null); // Store error messages
  const [ipfsHash, setIpfsHash] = useState<string | null>(null); // Store IPFS hash after upload
  const [mintedTokenId, setMintedTokenId] = useState<string | null>(null); // Store minted token ID
  // If an image URL is provided, use it to skip generation step
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(providedImageUrl || null);

  // Function to switch the user's wallet to Polygon Amoy testnet
  const switchToPolygonAmoy = async (provider: ethers.providers.Web3Provider) => {
    try {
      console.log("Attempting to switch to Polygon Amoy..."); // Log attempt to switch networks
      await provider.send('wallet_switchEthereumChain', [{ chainId: `0x${POLYGON_AMOY_CHAIN_ID.toString(16)}` }]); // Request wallet to switch chains
      console.log("Successfully switched to Polygon Amoy"); // Log successful network switch
    } catch (switchError: unknown) {
      console.log("Error switching network:", switchError); // Log error when switching networks
      if (typeof switchError === 'object' && switchError && 'code' in switchError && switchError.code === 4902) {
        try {
          console.log("Network not found, attempting to add Polygon Amoy..."); // Log attempt to add network
          await provider.send('wallet_addEthereumChain', [
            {
              chainId: `0x${POLYGON_AMOY_CHAIN_ID.toString(16)}`, // Chain ID in hex format
              chainName: 'Polygon Amoy Testnet', // Network name
              nativeCurrency: {
                name: 'MATIC', // Currency name
                symbol: 'MATIC', // Currency symbol
                decimals: 18 // Currency decimals
              },
              rpcUrls: ['https://rpc-amoy.polygon.technology'], // RPC endpoint
              blockExplorerUrls: ['https://www.oklink.com/amoy'] // Block explorer URL
            }
          ]);
          console.log("Successfully added Polygon Amoy"); // Log successful network addition
        } catch (addError) {
          console.error("Error adding network:", addError); // Log error when adding network
          throw new Error('Could not add Polygon Amoy network'); // Throw error for failed network addition
        }
      }
      throw new Error('Could not switch to Polygon Amoy network'); // Throw error for failed network switch
    }
  };

  // Main function to handle the minting process
  const handleMint = async () => {
    if (!isConnected) {
      connect({ connector: injected() }); // Connect wallet if not already connected
      return;
    }

    setIsMinting(true); // Set minting status to true
    setError(null); // Clear any previous errors

    try {
      let imageUrl = generatedImageUrl;
      
      // Only generate image if no image URL was provided
      if (!imageUrl) {
        // Step 1: Generate image using our improved API endpoint with retry logic
        console.log('Generating image through local API...'); // Log start of image generation
        let response;
        let retries = 0;
        const maxRetries = 3; // Maximum number of retry attempts
        
        while (retries < maxRetries) {
          try {
            response = await fetch('/api/generate', { // Call local API to generate image
              method: 'POST', // Use POST HTTP method
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                prompt: "a beautiful fantasy landscape with mountains and a river, high quality, detailed", // Image generation prompt
                negative_prompt: "ugly, blurry, low quality", // Negative prompt for better quality
                steps: 20, // Number of diffusion steps
                cfg_scale: 7.0, // Configuration scale for image generation
                width: 512, // Image width
                height: 512, // Image height
                sampler_name: "k_euler_a" // Sampler algorithm
              }),
            });
            
            // If successful, break out of retry loop
            if (response.ok) break;
            
            console.log(`API request failed (attempt ${retries + 1}/${maxRetries}), status: ${response.status}`); // Log failed attempt
          } catch (fetchError) {
            console.error(`Network error during API request (attempt ${retries + 1}/${maxRetries}):`, fetchError); // Log network error
          }
          
          retries++; // Increment retry counter
          if (retries < maxRetries) {
            // Wait before retrying (exponential backoff)
            const waitTime = Math.min(1000 * Math.pow(2, retries), 8000); // Calculate wait time with exponential backoff
            console.log(`Retrying in ${waitTime}ms...`); // Log retry wait time
            await new Promise(resolve => setTimeout(resolve, waitTime)); // Wait before next retry
          }
        }

        if (!response || !response.ok) {
          const errorMessage = response ? await response.text().catch(() => 'Unknown error') : 'Network request failed'; // Get error message if available
          throw new Error(`Failed to generate image after ${maxRetries} attempts: ${errorMessage}`); // Throw error after all retries fail
        }

        const responseData = await response.json().catch(() => {
          throw new Error('Failed to parse API response as JSON'); // Throw error if JSON parsing fails
        });
        
        if (!responseData.image) {
          throw new Error('API response missing image data'); // Throw error if response is missing image data
        }

        imageUrl = `data:image/png;base64,${responseData.image}`; // Create base64 data URL for the image
        setGeneratedImageUrl(imageUrl); // Save the generated image URL
        console.log('Generated image successfully'); // Log successful image generation
      } else {
        console.log('Using provided image, skipping generation step');
      }

      // Step 3: Process the generated image
      console.log('Processing image...'); // Log start of image processing
      let blob;
      try {
        blob = await fetch(imageUrl).then(r => r.blob()); // Convert data URL to blob
        console.log('Image blob size:', blob.size); // Log blob size
        
        if (blob.size === 0) {
          throw new Error('Image is empty'); // Throw error if blob is empty
        }
      } catch (blobError) {
        console.error('Error processing image blob:', blobError); // Log blob processing error
        throw new Error('Failed to process the image'); // Throw error for failed blob processing
      }

      // Step 4: Upload to IPFS with improved error handling
      console.log('Uploading to IPFS...'); // Log start of IPFS upload
      const formData = new FormData(); // Create form data for file upload
      formData.append('file', blob); // Add blob to form data

      // Check for Pinata JWT token
      if (!process.env.NEXT_PUBLIC_PINATA_JWT) {
        throw new Error('Pinata JWT token not configured'); // Throw error if Pinata token is missing
      }
      
      console.log('Starting IPFS upload...'); // Log start of IPFS upload
      
      // Use AbortController to set a timeout for the fetch request
      const controller = new AbortController(); // Create abort controller for request timeout
      const timeoutId = setTimeout(() => controller.abort(), 30000); // Set 30 second timeout
      
      try {
        // Retry IPFS upload if needed
        let ipfsResponse;
        let retries = 0;
        const maxRetries = 3; // Maximum number of retry attempts
        
        while (retries < maxRetries) {
          try {
            ipfsResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', { // Upload to Pinata IPFS
              method: 'POST', // Use POST HTTP method
              headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`, // Authorization header with JWT
              },
              body: formData, // Form data with file
              signal: controller.signal // Abort signal for timeout
            });
            
            // If successful, break out of retry loop
            if (ipfsResponse.ok) break;
            
            console.log(`IPFS upload failed (attempt ${retries + 1}/${maxRetries}), status: ${ipfsResponse.status}`); // Log failed attempt
          } catch (fetchError) {
            if (fetchError instanceof Error && fetchError.name === 'AbortError') {
              throw new Error('IPFS upload timed out after 30 seconds'); // Throw error if request times out
            }
            console.error(`Network error during IPFS upload (attempt ${retries + 1}/${maxRetries}):`, fetchError); // Log network error
          }
          
          retries++; // Increment retry counter
          if (retries < maxRetries) {
            // Wait before retrying (exponential backoff)
            const waitTime = Math.min(2000 * Math.pow(2, retries), 8000); // Calculate wait time with exponential backoff
            console.log(`Retrying IPFS upload in ${waitTime}ms...`); // Log retry wait time
            await new Promise(resolve => setTimeout(resolve, waitTime)); // Wait before next retry
          }
        }
        
        // Clear the timeout since the request completed
        clearTimeout(timeoutId); // Clear timeout after request completes

        if (!ipfsResponse || !ipfsResponse.ok) {
          const errorText = ipfsResponse ? await ipfsResponse.text().catch(() => 'Unknown error') : 'Network request failed'; // Get error text if available
          throw new Error(`Failed to upload to IPFS after ${maxRetries} attempts: ${errorText}`); // Throw error after all retries fail
        }

        const ipfsResult = await ipfsResponse.json().catch(() => {
          throw new Error('Failed to parse IPFS response as JSON'); // Throw error if JSON parsing fails
        });
        
        console.log('IPFS upload successful:', ipfsResult); // Log successful IPFS upload
        const { IpfsHash } = ipfsResult; // Extract IPFS hash from response
        
        if (!IpfsHash) {
          throw new Error('IPFS response missing hash'); // Throw error if IPFS hash is missing
        }
        
        // Store the IPFS hash in component state
        setIpfsHash(IpfsHash);
        
        const tokenURI = `ipfs://${IpfsHash}`; // Create IPFS URI for the NFT
        console.log('Final tokenURI:', tokenURI); // Log token URI
        
        // Step 5: Mint NFT
        if (!window.ethereum) {
          throw new Error("Please install MetaMask"); // Throw error if MetaMask is not installed
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum); // Create Ethereum provider
        const network = await provider.getNetwork(); // Get current network
        
        if (network.chainId !== POLYGON_AMOY_CHAIN_ID) {
          await switchToPolygonAmoy(provider); // Switch to Polygon Amoy if on different network
          // After switching networks, we need to get a new provider instance
          const updatedProvider = new ethers.providers.Web3Provider(window.ethereum); // Create updated provider after network switch
          await updatedProvider.send("eth_requestAccounts", []); // Request account access
          const signer = updatedProvider.getSigner(); // Get signer for transactions
          
          const contract = new ethers.Contract(
            CONTRACT_ADDRESS, // Contract address
            BrowserMintNFT.abi, // Contract ABI
            signer // Signer to send transactions
          );

          console.log("Minting NFT with tokenURI:", tokenURI); // Log minting attempt
          const mintTx = await contract.mintNFT(tokenURI); // Call mintNFT function on contract
          console.log("Mint transaction sent:", mintTx.hash); // Log transaction hash
          
          const receipt = await mintTx.wait(); // Wait for transaction confirmation
          console.log("Full transaction receipt:", receipt); // Log transaction receipt

          // Get the tokenId from the return value
          const tokenId = receipt.events?.[0]?.topics?.[3]; // Extract token ID from event logs
          if (!tokenId) {
            console.error("No token ID found in events:", receipt.events); // Log error if token ID is missing
            throw new Error("Failed to get token ID from transaction"); // Throw error for missing token ID
          }

          // Convert from hex to decimal
          const tokenIdDecimal = ethers.BigNumber.from(tokenId).toString(); // Convert token ID to decimal string
          console.log("Token ID:", tokenIdDecimal); // Log token ID
          setMintedTokenId(tokenIdDecimal); // Store token ID in state
          // Call parent component callbacks if provided
          if (setTokenId) {
            setTokenId(tokenIdDecimal); // Call setTokenId callback if provided
          }
          if (setMintedTokenId) {
            setMintedTokenId(tokenIdDecimal); // Call setMintedTokenId callback if provided
          }
        } else {
          // If already on Polygon Amoy
          const signer = provider.getSigner(); // Get signer for current network
          const contract = new ethers.Contract(
            CONTRACT_ADDRESS, // Contract address
            BrowserMintNFT.abi, // Contract ABI
            signer // Signer to send transactions
          );

          console.log("Minting NFT with tokenURI:", tokenURI); // Log minting attempt
          const mintTx = await contract.mintNFT(tokenURI); // Call mintNFT function on contract
          console.log("Mint transaction sent:", mintTx.hash); // Log transaction hash
          
          const receipt = await mintTx.wait(); // Wait for transaction confirmation
          console.log("Full transaction receipt:", receipt); // Log transaction receipt

          // Get the tokenId from the return value
          const tokenId = receipt.events?.[0]?.topics?.[3]; // Extract token ID from event logs
          if (!tokenId) {
            console.error("No token ID found in events:", receipt.events); // Log error if token ID is missing
            throw new Error("Failed to get token ID from transaction"); // Throw error for missing token ID
          }

          // Convert from hex to decimal
          const tokenIdDecimal = ethers.BigNumber.from(tokenId).toString(); // Convert token ID to decimal string
          console.log("Token ID:", tokenIdDecimal); // Log token ID
          setMintedTokenId(tokenIdDecimal); // Store token ID in state
          // Call parent component callbacks if provided
          if (setTokenId) {
            setTokenId(tokenIdDecimal); // Call setTokenId callback if provided
          }
          if (setMintedTokenId) {
            setMintedTokenId(tokenIdDecimal); // Call setMintedTokenId callback if provided
          }
        }
      } catch (unknownError) {
        // Properly handle error with type checking
        if (unknownError instanceof Error && unknownError.name === 'AbortError') {
          throw new Error('IPFS upload timed out after 30 seconds'); // Throw error for timeout
        }
        throw unknownError; // Re-throw other errors
      }

    } catch (err) {
      console.error("Detailed minting error:", err); // Log detailed error
      if (err instanceof Error) {
        setError(err.message); // Set error message from Error object
      } else {
        setError("Failed to mint NFT"); // Set generic error message
      }
    } finally {
      setIsMinting(false); // Reset minting status regardless of outcome
    }
  };

  // Function to open MetaMask website for wallet creation
  const handleCreateWallet = () => {
    window.open('https://metamask.io/download/', '_blank'); // Open MetaMask download page in new tab
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <button
        onClick={handleMint} // Call mint function on click
        disabled={isMinting} // Disable button while minting
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
          "Mint NFT" // Show mint text if wallet is connected
        ) : (
          "Connect Wallet" // Show connect text if wallet is not connected
        )}
      </button>

      {error && (
        <div className="text-red-500 text-sm">
          {error} {/* Display error message if present */}
        </div>
      )}

      {/* NFT Viewer shows IPFS and blockchain information */}
      {ipfsHash && <NFTViewer ipfsHash={ipfsHash} tokenId={mintedTokenId} />} {/* Show NFT viewer if IPFS hash exists */}

      <button
        onClick={handleCreateWallet} // Open MetaMask website on click
        className="text-blue-500 hover:text-blue-600 text-sm underline"
      >
        Don&apos;t have a wallet? {/* Provide option for users without wallets */}
      </button>
    </div>
  );
}

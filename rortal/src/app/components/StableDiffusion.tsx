"use client" // Enable client-side rendering for Next.js

import { useState } from 'react'; // Import React's state management hook
import Image from 'next/image'; // Import Next.js optimized image component
import FloatingWords from './FloatingWords'; // Import custom component for interactive word selection
import axios from 'axios'; // Import axios for HTTP requests to Pinata

// Define an array of creative keywords that will float around the UI for users to select
const WORDS = [
  "vibe", "noise", "liquid", "flow", "energy", "wave", "pulse", "glow", "melt", "swirl"
];

// Base prompt that will be combined with user-selected words for image generation
const BASE_PROMPT = "simple gradient which is";

// TypeScript interface defining component props
interface StableDiffusionProps {
  onImageGenerated?: (imageUrl: string) => void; // Optional callback function when image is generated
}

// Function to upload to Pinata IPFS service
const uploadToPinata = async (file: File): Promise<string> => {
  try {
    // Create form data to send file
    const formData = new FormData();
    formData.append('file', file);

    // Check for Pinata API key
    if (!process.env.NEXT_PUBLIC_PINATA_API_KEY) {
      throw new Error('Pinata API key not configured');
    }

    // Make request to Pinata API
    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', 
      formData,
      {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_API_KEY}`,
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60000 // 30 second timeout
      }
    );

    // Return the IPFS hash/CID from the response
    if (response.data && response.data.IpfsHash) {
      return `ipfs://${response.data.IpfsHash}`;
    } else {
      throw new Error('No IPFS hash returned from Pinata');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle specific Axios errors
      if (error.response) {
        throw new Error(`Pinata upload failed: ${error.response.status} - ${error.response.data?.error || 'Unknown error'}`);
      } else if (error.request) {
        throw new Error('No response received from Pinata');
      } else {
        throw new Error(`Error setting up request: ${error.message}`);
      }
    }
    // Re-throw any other errors
    throw error;
  }
};

// StableDiffusion component definition
export default function StableDiffusion({ onImageGenerated }: StableDiffusionProps) {
  // State for tracking selected words from the floating words UI
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  // State to store the base64 data URL of the generated image
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  // State to store the IPFS URL after upload
  const [ipfsUrl, setIpfsUrl] = useState<string | null>(null);
  // State to track if image generation is in progress
  const [isGenerating, setIsGenerating] = useState(false);
  // State to track if IPFS upload is in progress
  const [isUploading, setIsUploading] = useState(false);
  // State to store error messages
  const [error, setError] = useState<string | null>(null);
  // State to store the image as a Blob for IPFS upload
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);

  // Function to toggle word selection when a word is clicked
  const toggleWord = (word: string) => {
    setSelectedWords(prev => 
      prev.includes(word)
        ? prev.filter(w => w !== word) // Remove word if already selected
        : [...prev, word] // Add word if not already selected
    );
  };

  // Function to handle the image generation process
  const handleGenerate = async () => {
    if (selectedWords.length === 0) return; // Don't proceed if no words selected
    
    // Update UI states for generation process
    setIsGenerating(true);
    setError(null);
    setIpfsUrl(null);
    setImageBlob(null);

    try {
      // Call the local API endpoint that connects to Stable Horde
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `${BASE_PROMPT}, ${selectedWords.join(', ')}`, // Combine base prompt with selected words
          negative_prompt: "text, watermark, signature, blurry", // Common negative prompts
          steps: 25, // More steps for quality with Stable Horde
          cfg_scale: 7.0, // Standard cfg_scale for Stable Horde
          width: 512, // Standard width
          height: 512, // Standard height
          sampler_name: "k_euler_a", // Standard sampler for Stable Horde
          seed: "-1", // Random seed as a string
        }),
      });

      // Handle API errors
      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      // Parse response data
      const data = await response.json();
      setGeneratedImage(data.image); // Store the base64 image
      
      // Call the callback function if provided to notify parent component
      if (onImageGenerated) {
        onImageGenerated(data.image);
      }

      // Convert base64 image to a blob for IPFS upload
      const imageResponse = await fetch(data.image);
      const blob = await imageResponse.blob();
      setImageBlob(blob);

    } catch (err) {
      // Handle and display errors
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      // Reset loading state when done
      setIsGenerating(false);
    }
  };

  // Function to handle uploading the generated image to IPFS via Pinata
  const handleUploadToIPFS = async () => {
    if (!imageBlob) return; // Don't proceed if no image blob exists

    // Update UI states for upload process
    setIsUploading(true);
    setError(null);

    try {
      // Create a File object from the blob for upload
      const file = new File([imageBlob], 'generated-image.png', { type: 'image/png' });
      
      // Upload the file to IPFS using the Pinata function
      const pinataUrl = await uploadToPinata(file);
      setIpfsUrl(pinataUrl); // Store the returned IPFS URL
    } catch (err) {
      // Handle and display upload errors
      setError(err instanceof Error ? err.message : 'Failed to upload to IPFS');
    } finally {
      // Reset loading state when done
      setIsUploading(false);
    }
  };

  // Component UI rendering
  return (
    <div className="flex flex-row gap-12 w-full h-full">
      {/* Left side - Word selection area */}
      <div className="w-1/2 flex flex-col items-center justify-center">
        <div className="w-full h-[400px]">
          <FloatingWords 
            words={WORDS} // Pass available words
            selectedWords={selectedWords} // Pass currently selected words
            onWordClick={toggleWord} // Pass click handler
          />
        </div>
        
        {/* Action buttons for generation and upload */}
        <div className="flex gap-4 mt-8">
          {/* Generate button */}
          <button
            onClick={handleGenerate} // Call generation function on click
            disabled={isGenerating || selectedWords.length === 0} // Disable while generating or if no words selected
            className="bg-primary text-primary-foreground w-[48px] h-[48px] rounded-lg font-medium hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isGenerating ? (
              <div className="loading-circle" /> // Show loading spinner while generating
            ) : (
              // Magic wand icon for generation
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.71 5.63l-2.34 2.34a2.12 2.12 0 0 0 0 3l1.83 1.83a2.12 2.12 0 0 1 0 3l-7.17 7.17a2.12 2.12 0 0 1-3 0l-1.83-1.83a2.12 2.12 0 0 0-3 0l-2.34 2.34a2.12 2.12 0 0 1-3 0l-1.83-1.83a2.12 2.12 0 0 1 0-3l7.17-7.17a2.12 2.12 0 0 1 3 0l1.83 1.83a2.12 2.12 0 0 0 3 0l2.34-2.34a2.12 2.12 0 0 1 3 0l1.83 1.83a2.12 2.12 0 0 1 0 3z"/>
              </svg>
            )}
          </button>

          {/* Upload to IPFS button - only shown after image generation and before upload */}
          {generatedImage && !ipfsUrl && (
            <button
              onClick={handleUploadToIPFS} // Call IPFS upload function on click
              disabled={isUploading} // Disable while uploading
              className="bg-secondary text-secondary-foreground w-[48px] h-[48px] rounded-lg font-medium hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isUploading ? (
                <div className="loading-circle" /> // Show loading spinner while uploading
              ) : ipfsUrl ? (
                // Success checkmark icon
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              ) : (
                // Upload icon
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Right side - Image preview area */}
      <div className="w-1/2 flex flex-col items-center justify-center min-h-[256px]">
        {generatedImage ? (
          <>
            {/* Show generated image if available */}
            <div className="relative w-[60%] h-[60%]">
              <Image
                src={generatedImage} // Image source (base64 data URL)
                alt="Generated abstract gradient" // Alt text for accessibility
                fill // Fill container
                className="object-contain" // Maintain aspect ratio
              />
            </div>
            {/* Display IPFS URL if uploaded */}
            {ipfsUrl && (
              <div className="mt-4 text-sm text-muted-foreground break-all">
                IPFS: {ipfsUrl} {/* Show IPFS URL after successful upload */}
              </div>
            )}
          </>
        ) : (
          // Placeholder when no image has been generated yet
          <div className="w-full h-full flex items-center justify-center bg-secondary/20 rounded-lg">
            <p className="text-secondary-foreground/50">preview</p>
          </div>
        )}
      </div>

      {/* Error message display - conditionally rendered at bottom of component */}
      {error && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-destructive text-sm">
          {error} {/* Display error message if one exists */}
        </div>
      )}
    </div>
  );
}
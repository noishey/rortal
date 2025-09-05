"use client"

import { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import PromptWindow from './PromptWindow';

// Base prompt for image generation
const BASE_PROMPT = "abstract digital art with";

// TypeScript interface defining component props
interface StableDiffusionProps {
  onImageGenerated?: (imageUrl: string) => void;
}

// Function to upload to Pinata IPFS service
const uploadToPinata = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    if (!process.env.NEXT_PUBLIC_PINATA_API_KEY) {
      throw new Error('Pinata API key not configured');
    }

    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', 
      formData,
      {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_API_KEY}`,
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60000
      }
    );

    if (response.data && response.data.IpfsHash) {
      return `ipfs://${response.data.IpfsHash}`;
    } else {
      throw new Error('No IPFS hash returned from Pinata');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Pinata upload failed: ${error.response.status} - ${error.response.data?.error || 'Unknown error'}`);
      } else if (error.request) {
        throw new Error('No response received from Pinata');
      } else {
        throw new Error(`Error setting up request: ${error.message}`);
      }
    }
    throw error;
  }
};

export default function StableDiffusion({ onImageGenerated }: StableDiffusionProps) {
  // Remove slider states - replace with prompt states
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  
  // Parameter states
  const [noise, setNoise] = useState(5);
  const [swirl, setSwirl] = useState(5);
  const [energy, setEnergy] = useState(5);
  
  // Image states
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [ipfsUrl, setIpfsUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);

  // Function to handle the image generation process
  // Add better error logging in handleGenerate function
  const handleGenerate = async (prompt?: string) => {
    setIsGenerating(true);
    setError(null);
    setIpfsUrl(null);
    setImageBlob(null);
  
    try {
      // Use the prompt directly instead of building from slider values
      const fullPrompt = prompt || currentPrompt || "abstract digital art, highly detailed, vibrant colors";

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: fullPrompt,
          negative_prompt: "text, watermark, signature, blurry",
          steps: 25,
          cfg_scale: 7.0,
          width: 512,
          height: 512,
          sampler_name: "k_euler_a",
          seed: "-1",
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to generate image`);
      }

      const data = await response.json();
      setGeneratedImage(data.image);
      
      if (onImageGenerated) {
        onImageGenerated(data.image);
      }

      const imageResponse = await fetch(data.image);
      const blob = await imageResponse.blob();
      setImageBlob(blob);

    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to handle uploading to IPFS
  const handleUploadToIPFS = async () => {
    if (!imageBlob) return;

    setIsUploading(true);
    setError(null);

    try {
      const file = new File([imageBlob], 'generated-image.png', { type: 'image/png' });
      const pinataUrl = await uploadToPinata(file);
      setIpfsUrl(pinataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload to IPFS');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Replace Parameter Controls with Chat Prompt Button */}
      <div className="space-y-4">
        <button
          onClick={() => setIsPromptOpen(true)}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          <span className="text-2xl">🎨</span>
          <div className="text-left">
            <div className="font-semibold">Describe Your Art</div>
            <div className="text-sm opacity-90">Chat with AI to create the perfect prompt</div>
          </div>
        </button>
        
        {/* Show current prompt if exists */}
        {currentPrompt && (
          <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-purple-500">
            <p className="text-sm text-gray-600 mb-1">Current Prompt:</p>
            <p className="text-gray-800 font-medium">{currentPrompt}</p>
          </div>
        )}
      </div>

      {/* Generate Button - only show if we have a prompt */}
      {currentPrompt && (
        <button
          onClick={() => handleGenerate()}
          disabled={isGenerating}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              Generating...
            </>
          ) : (
            'Generate Art'
          )}
        </button>
      )}

      {/* Image Preview */}
      {generatedImage && (
        <div className="space-y-4">
          <div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={generatedImage}
              alt="Generated artwork"
              width={512}
              height={512}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Upload to IPFS Button */}
          {!ipfsUrl && (
            <button
              onClick={handleUploadToIPFS}
              disabled={isUploading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Uploading...
                </>
              ) : (
                'Upload to IPFS'
              )}
            </button>
          )}
          
          {/* IPFS URL Display */}
          {ipfsUrl && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 font-medium mb-1">Uploaded to IPFS:</p>
              <p className="text-xs text-green-600 break-all">{ipfsUrl}</p>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      
      {/* Chat Prompt Window */}
      <PromptWindow
        isOpen={isPromptOpen}
        onClose={() => setIsPromptOpen(false)}
        onGenerate={(prompt) => {
          setCurrentPrompt(prompt);
          setIsPromptOpen(false);
          handleGenerate(prompt);
        }}
      />
    </div>
  );
}
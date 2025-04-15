"use client"

import { useState } from 'react';
import Image from 'next/image';
import FloatingWords from './FloatingWords';
import { uploadToIPFS } from '@/utils/ipfs';

const WORDS = [
  "vibe", "noise", "liquid", "flow", "energy", "wave", "pulse", "glow", "melt", "swirl"
];

const BASE_PROMPT = "abstract gradient, smooth color transitions, low quality, pixel art";

export default function StableDiffusion() {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [ipfsUrl, setIpfsUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleWord = (word: string) => {
    setSelectedWords(prev => 
      prev.includes(word) 
        ? prev.filter(w => w !== word)
        : [...prev, word]
    );
  };

  const handleGenerate = async () => {
    if (selectedWords.length === 0) return;
    
    setIsGenerating(true);
    setError(null);
    setIpfsUrl(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `${BASE_PROMPT}, ${selectedWords.join(', ')}`,
          negative_prompt: "text, words, letters, low quality, blurry, distorted",
          steps: 30,
          cfg_scale: 7.5,
          width: 512,
          height: 512,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      setGeneratedImage(data.image);

      // Upload to IPFS
      setIsUploading(true);
      const ipfsUrl = await uploadToIPFS(data.image);
      setIpfsUrl(ipfsUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsGenerating(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-row gap-12 w-full h-full">
      {/* Left side - Word selection */}
      <div className="w-1/2 flex flex-col items-center justify-center">
        <div className="w-full h-[400px]">
          <FloatingWords 
            words={WORDS}
            selectedWords={selectedWords}
            onWordClick={toggleWord}
          />
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={isGenerating || selectedWords.length === 0}
          className="mt-8 bg-primary text-primary-foreground w-[48px] h-[48px] rounded-lg font-medium hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isGenerating || isUploading ? (
            <div className="loading-circle" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.71 5.63l-2.34 2.34a2.12 2.12 0 0 0 0 3l1.83 1.83a2.12 2.12 0 0 1 0 3l-7.17 7.17a2.12 2.12 0 0 1-3 0l-1.83-1.83a2.12 2.12 0 0 0-3 0l-2.34 2.34a2.12 2.12 0 0 1-3 0l-1.83-1.83a2.12 2.12 0 0 1 0-3l7.17-7.17a2.12 2.12 0 0 1 3 0l1.83 1.83a2.12 2.12 0 0 0 3 0l2.34-2.34a2.12 2.12 0 0 1 3 0l1.83 1.83a2.12 2.12 0 0 1 0 3z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Right side - Image preview */}
      <div className="w-1/2 flex flex-col items-center justify-center min-h-[512px]">
        {generatedImage ? (
          <>
            <div className="relative w-full h-full">
              <Image
                src={generatedImage}
                alt="Generated abstract gradient"
                fill
                className="object-contain"
              />
            </div>
            {ipfsUrl && (
              <div className="mt-4 text-sm text-muted-foreground break-all">
                IPFS: {ipfsUrl}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/20 rounded-lg">
            <p className="text-secondary-foreground/50">Select words and paint</p>
          </div>
        )}
      </div>

      {error && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-destructive text-sm">
          {error}
        </div>
      )}
    </div>
  );
} 
"use client"

import { useState } from 'react';
import Image from 'next/image';
import FloatingWords from './FloatingWords';

const WORDS = [
  "vibe", "noise", "liquid", "flow", "energy", "wave", "pulse", "glow", "melt", "swirl"
];

const BASE_PROMPT = "abstract gradient, smooth color transitions, low quality, pixel art";

export default function StableDiffusion() {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsGenerating(false);
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
          className="mt-8 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : (
            'Generate'
          )}
        </button>
      </div>

      {/* Right side - Image preview */}
      <div className="w-1/2 flex items-center justify-center min-h-[512px]">
        {generatedImage ? (
          <div className="relative w-full h-full">
            <Image
              src={generatedImage}
              alt="Generated abstract gradient"
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/20 rounded-lg">
            <p className="text-secondary-foreground/50">Select words and generate</p>
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
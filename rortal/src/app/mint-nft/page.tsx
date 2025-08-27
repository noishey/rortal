'use client';

import { useState } from 'react';
import StableDiffusion from '../components/StableDiffusion';
import MintButton from '../components/MintButton';
import ConnectButton from '../components/ConnectButton';

export default function MintNFT() {
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [mintedTokenId, setMintedTokenId] = useState<string | null>(null);

  const handleImageGenerated = (imageUrl: string) => {
    setGeneratedImageUrl(imageUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto">
      {/* Simple Header - Fixed */}
      <header className="sticky top-0 bg-gray-50 z-10 p-4 border-b border-gray-200">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <h1 className="text-xl font-bold">Rortal</h1>
          <ConnectButton />
        </div>
      </header>

      {/* Main Content - Scrollable */}
      <main className="max-w-md mx-auto p-4 pb-8 space-y-6">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Create NFT</h2>
          <p className="text-gray-600">Generate AI art and mint as NFT</p>
        </div>

        {/* Step 1: Generate */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold mb-4">1. Generate Art</h3>
          <StableDiffusion onImageGenerated={handleImageGenerated} />
        </div>

        {/* Step 2: Preview */}
        {generatedImageUrl && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-4">2. Preview</h3>
            <img
              src={generatedImageUrl}
              alt="Generated artwork"
              className="w-full aspect-square object-cover rounded-lg"
            />
          </div>
        )}

        {/* Step 3: Mint */}
        {generatedImageUrl && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-4">3. Mint NFT</h3>
            <MintButton 
              setTokenId={setMintedTokenId} 
              imageUrl={generatedImageUrl} 
            />
          </div>
        )}

        {/* Success */}
        {mintedTokenId && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-2">Success!</h3>
            <p className="text-green-700 text-sm mb-2">
              NFT minted successfully
            </p>
            <p className="text-xs text-green-600">
              Token ID: {mintedTokenId}
            </p>
            <a 
              href={`https://www.oklink.com/amoy/address/0xd9Aa3fAe83B41f4F9835fB7ab7d087f0c91419ED`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-green-600 hover:text-green-800 underline text-sm"
            >
              View on Explorer
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
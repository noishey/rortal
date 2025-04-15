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

  const handleMintSuccess = (tokenId: string) => {
    setMintedTokenId(tokenId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Rortal</h1>
          <ConnectButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-6 max-w-7xl mx-auto">
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Create Your NFT</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Generate unique AI art and mint it as an NFT on the Polygon network.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <StableDiffusion onImageGenerated={handleImageGenerated} />
            </div>

            {generatedImageUrl && (
              <div className="space-y-6">
                <div className="aspect-square rounded-lg overflow-hidden border border-white/10">
                  <img
                    src={generatedImageUrl}
                    alt="Generated artwork"
                    className="w-full h-full object-cover"
                  />
                </div>
                <MintButton onMintSuccess={handleMintSuccess} />
              </div>
            )}
          </div>

          {mintedTokenId && (
            <div className="text-center p-4 bg-green-500/20 rounded-lg">
              <p>Successfully minted NFT with token ID: {mintedTokenId}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 
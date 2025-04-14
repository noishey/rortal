"use client"

import Image from 'next/image';  // Import Image from next/image
import { useState } from 'react';
import Sliders from "./components/Sliders";
import PreviewBox from "./components/PreviewBox";
import MintButton from "@/app/components/MintButton";
import MintedNFT from "./components/MintedNFT";

export default function Home() {
  const [mintedTokenId, setMintedTokenId] = useState<string | null>(null);
  return (
    <main className="grid grid-cols-1 grid-rows-5 md:grid-cols-2 md:grid-rows-3 min-h-screen w-screen bg-background text-foreground">
      
      {/* Viewport 1 */}
      <div className="border border-secondary flex flex-col items-center justify-center md:justify-start p-4 overflow-y-auto h-screen md:h-full">
        <div className="flex flex-row items-center justify-between w-full">
          {/* Left text */}
          <div>
            <p className="text-6xl font-bold">((( r )))</p>
            <p className="text-lg">&ldquo;leave a mark&rdquo;</p>
          </div>

          {/* Right image */}
          <div className="w-1/2">
            <Image
              src="/22.png"  // Path to the image inside the public folder
              alt="Your Image"     // Alt text for accessibility
              width={400}           // Width of the image
              height={400}          // Height of the image
              objectFit="cover"     // Optional: to cover the container while preserving aspect ratio
            />
          </div>
        </div>
      </div>

      {/* Viewport 2 */}
      <div className="border border-secondary flex flex-col items-center justify-start p-4 overflow-y-auto h-screen md:h-full">
        {/* Viewport 2 content */}
        <Sliders />
        <PreviewBox imageSrc={null} isLoading={false} />
      </div>

      {/* Viewport 3 */}
      <div className="border border-secondary flex flex-col items-center justify-start p-4 overflow-y-auto h-screen md:h-full">
        <div className="flex flex-col gap-4 items-center">
          <button className="bg-primary text-foreground px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors">
          {!mintedTokenId ? (
            <MintButton onMintSuccess={setMintedTokenId} />
          ) : (
            <MintedNFT tokenId={mintedTokenId} />
          )}
          </button>
        </div>
      </div>

      {/* Viewport 4 */}
      <div className="border border-secondary flex flex-col items-center justify-start p-4 overflow-y-auto h-screen md:h-full">
        {/* Viewport 4 grid layout with 1:1 grids */}
        <div className="grid grid-cols-1 grid-rows-1 h-full w-full">
          <p>Gallery</p>
        </div>
      </div>

      {/* Viewport 5 */}
      <div className="border border-secondary flex flex-col items-center justify-start p-4 overflow-y-auto h-screen md:h-full">
        <div className="flex flex-col gap-4">
          <button className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors">
            Buy Me a Coffee
          </button>
          <button className="bg-foreground text-background px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors">
            Tip
          </button>
          <button className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors">
            Contribute
          </button>
        </div>
      </div>
    </main>
  );
}

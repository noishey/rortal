'use client';

import { useState, useEffect, useRef } from 'react';
import StableDiffusion from '../components/StableDiffusion';
import MintButton from '../components/MintButton';
import ConnectButton from '../components/ConnectButton';

export default function MintNFT() {
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [mintedTokenId, setMintedTokenId] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleImageGenerated = (imageUrl: string) => {
    setGeneratedImageUrl(imageUrl);
    // Auto-scroll to the second panel when image is generated
    setTimeout(() => {
      setActivePanel(1);
    }, 500);
  };

  // Update scroll position when active panel changes
  useEffect(() => {
    if (scrollContainerRef.current && activePanel >= 0) {
      const panelWidth = 500; // Match the width of panels
      const gap = 32; // Match the gap between panels (8 * 4 = 32px)
      scrollContainerRef.current.scrollTo({
        left: activePanel * (panelWidth + gap),
        behavior: 'smooth'
      });
    }
  }, [activePanel]);

  // Update active panel when token is minted
  useEffect(() => {
    if (mintedTokenId) {
      setActivePanel(2);
    }
  }, [mintedTokenId]);

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
      <main className="pt-24 px-4 md:px-6 max-w-full mx-auto">
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Create Your NFT</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Generate unique AI art and mint it as an NFT on the Polygon network.
            </p>
          </div>

          {/* Process steps indicator */}
          <div className="hidden md:flex justify-center mb-6">
            <div className="flex items-center">
              <div 
                className={`h-8 w-8 rounded-full flex items-center justify-center ${activePanel >= 0 ? 'bg-blue-500' : 'bg-gray-700'}`}
              >
                1
              </div>
              <div className={`w-20 h-1 ${activePanel >= 1 ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
              <div 
                className={`h-8 w-8 rounded-full flex items-center justify-center ${activePanel >= 1 ? 'bg-blue-500' : 'bg-gray-700'}`}
              >
                2
              </div>
              <div className={`w-20 h-1 ${activePanel >= 2 ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
              <div 
                className={`h-8 w-8 rounded-full flex items-center justify-center ${activePanel >= 2 ? 'bg-blue-500' : 'bg-gray-700'}`}
              >
                3
              </div>
            </div>
          </div>

          {/* Scroll navigation widget */}
          <div className="relative">
            {/* Left scroll arrow */}
            <button 
              onClick={() => setActivePanel(Math.max(0, activePanel - 1))}
              disabled={activePanel === 0}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-900/80 hover:bg-gray-800 p-2 rounded-full shadow-lg transition-all ${
                activePanel === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
              }`}
              aria-label="Previous panel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            {/* Right scroll arrow */}
            <button 
              onClick={() => {
                const nextPanel = activePanel + 1;
                if (nextPanel === 1 && !generatedImageUrl) return;
                if (nextPanel === 2 && !mintedTokenId) return;
                if (nextPanel <= 2) setActivePanel(nextPanel);
              }}
              disabled={
                (activePanel === 1 && !generatedImageUrl) || 
                (activePanel === 2) || 
                (activePanel === 0 && !generatedImageUrl)
              }
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-900/80 hover:bg-gray-800 p-2 rounded-full shadow-lg transition-all ${
                (activePanel === 2 || 
                (activePanel === 1 && !generatedImageUrl) || 
                (activePanel === 0 && !generatedImageUrl)) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'opacity-100'
              }`}
              aria-label="Next panel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>

            {/* Horizontal scrolling container */}
            <div 
              ref={scrollContainerRef}
              className="w-full overflow-x-auto pb-4 hide-scrollbar"
            >
              <div className="flex flex-nowrap gap-8 min-w-max px-4">
                {/* First panel - StableDiffusion */}
                <div 
                  className={`flex-shrink-0 w-[calc(100vw-32px)] sm:w-[500px] p-6 rounded-lg border-2 ${activePanel === 0 ? 'border-blue-500 bg-gray-800/50' : 'border-transparent bg-gray-800/30'}`}
                >
                  <h3 className="text-xl font-semibold mb-4">1. Generate Art</h3>
                  <StableDiffusion onImageGenerated={handleImageGenerated} />
                </div>

                {/* Second panel - Preview Image */}
                <div 
                  className={`flex-shrink-0 w-[calc(100vw-32px)] sm:w-[500px] p-6 rounded-lg border-2 transition-colors duration-300 ${activePanel === 1 ? 'border-blue-500 bg-gray-800/50' : 'border-transparent bg-gray-800/30'} ${generatedImageUrl ? 'opacity-100' : 'opacity-50'}`}
                  onClick={() => generatedImageUrl && setActivePanel(1)}
                >
                  <h3 className="text-xl font-semibold mb-4">2. Preview & Mint</h3>
                  {generatedImageUrl ? (
                    <div className="space-y-6">
                      <div className="aspect-square rounded-lg overflow-hidden border border-white/10">
                        <img
                          src={generatedImageUrl}
                          alt="Generated artwork"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <MintButton setTokenId={setMintedTokenId} />
                    </div>
                  ) : (
                    <div className="aspect-square rounded-lg overflow-hidden border border-white/10 flex items-center justify-center text-gray-500">
                      <p>Generate art first</p>
                    </div>
                  )}
                </div>

                {/* Third panel - NFT Details */}
                <div 
                  className={`flex-shrink-0 w-[calc(100vw-32px)] sm:w-[500px] p-6 rounded-lg border-2 transition-colors duration-300 ${activePanel === 2 ? 'border-blue-500 bg-gray-800/50' : 'border-transparent bg-gray-800/30'} ${mintedTokenId ? 'opacity-100' : 'opacity-50'}`}
                  onClick={() => mintedTokenId && setActivePanel(2)}
                >
                  <h3 className="text-xl font-semibold mb-4">3. NFT Details</h3>
                  {mintedTokenId ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-500/20 rounded-lg">
                        <p className="font-medium">Successfully minted NFT!</p>
                        <p className="text-sm mt-2">Token ID: <span className="font-mono">{mintedTokenId}</span></p>
                      </div>
                      <div className="p-4 bg-gray-700/30 rounded-lg">
                        <h4 className="font-medium mb-2">View on Blockchain</h4>
                        <a 
                          href={`https://www.oklink.com/amoy/address/0xd9Aa3fAe83B41f4F9835fB7ab7d087f0c91419ED`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm underline"
                        >
                          View on Polygon Amoy Explorer
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-square rounded-lg overflow-hidden border border-white/10 flex items-center justify-center text-gray-500">
                      <p>Mint NFT first</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicators / dots */}
          <div className="flex justify-center items-center space-x-3 mt-4">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={() => setActivePanel(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  activePanel === index 
                    ? 'bg-blue-500' 
                    : index < activePanel 
                      ? 'bg-blue-400/50' 
                      : 'bg-white/40'
                }`}
                disabled={
                  (index === 1 && !generatedImageUrl) || 
                  (index === 2 && !mintedTokenId)
                }
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          {/* Custom scroll widget */}
          <div className="mt-6 px-4 sm:px-8 md:px-12 max-w-md mx-auto">
            <div className="relative h-2 bg-gray-700 rounded-full">
              {/* Progress bar */}
              <div 
                className="absolute left-0 top-0 h-full bg-blue-500 rounded-full transition-all"
                style={{ 
                  width: `${Math.min(100, (activePanel / 2) * 100)}%`,
                }}
              ></div>
              
              {/* Draggable handle */}
              <div 
                className="absolute top-0 cursor-pointer transition-all"
                style={{ 
                  left: `${(activePanel / 2) * 100}%`, 
                  transform: 'translateX(-50%)', 
                }}
              >
                <div 
                  className={`h-6 w-6 -mt-2 rounded-full border-2 ${
                    (activePanel === 1 && !mintedTokenId) || 
                    (activePanel === 0 && !generatedImageUrl) 
                      ? 'border-gray-500 bg-gray-700' 
                      : 'border-blue-400 bg-blue-500'
                  } shadow-md flex items-center justify-center text-[10px] font-bold text-white`}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Do nothing, just prevent click from passing through
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    
                    // Get track element dimensions
                    const track = e.currentTarget.parentElement?.parentElement;
                    if (!track) return;
                    
                    const trackRect = track.getBoundingClientRect();
                    const trackWidth = trackRect.width;
                    const trackLeft = trackRect.left;
                    
                    // Add mouse move handler
                    const handleMouseMove = (moveEvent: MouseEvent) => {
                      const relativeX = moveEvent.clientX - trackLeft;
                      const percentage = Math.max(0, Math.min(1, relativeX / trackWidth));
                      
                      // Calculate the panel based on percentage
                      const calculatedPanel = Math.round(percentage * 2);
                      
                      // Check if the panel is valid to move to
                      if (
                        (calculatedPanel === 1 && !generatedImageUrl) ||
                        (calculatedPanel === 2 && !mintedTokenId)
                      ) {
                        return;
                      }
                      
                      setActivePanel(calculatedPanel);
                    };
                    
                    // Add mouse up handler to remove listeners
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };
                    
                    // Add event listeners
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                >
                  {activePanel + 1}
                </div>
              </div>
              
              {/* Track markers */}
              {[0, 1, 2].map((index) => (
                <div 
                  key={index}
                  className={`absolute top-0 h-2 w-2 rounded-full transform -translate-x-1/2 ${
                    index <= activePanel 
                      ? 'bg-blue-500' 
                      : 'bg-gray-500'
                  }`}
                  style={{ left: `${(index / 2) * 100}%` }}
                  onClick={() => {
                    if (
                      (index === 1 && !generatedImageUrl) ||
                      (index === 2 && !mintedTokenId)
                    ) {
                      return;
                    }
                    setActivePanel(index);
                  }}
                ></div>
              ))}
            </div>
            
            {/* Labels */}
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <div>Generate</div>
              <div>Preview</div>
              <div>NFT Details</div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
} 
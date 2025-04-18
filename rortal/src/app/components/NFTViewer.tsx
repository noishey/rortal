"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface NFTViewerProps {
  ipfsHash: string | null;
  tokenId?: string | null;
}

export default function NFTViewer({ ipfsHash, tokenId }: NFTViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!ipfsHash) return null;
  
  // IPFS gateway URLs for viewing the NFT
  const ipfsGateways = [
    { name: 'IPFS.io', url: `https://ipfs.io/ipfs/${ipfsHash}` },
    { name: 'Pinata Gateway', url: `https://gateway.pinata.cloud/ipfs/${ipfsHash}` },
    { name: 'Cloudflare', url: `https://cloudflare-ipfs.com/ipfs/${ipfsHash}` },
    { name: 'NFT.Storage', url: `https://nftstorage.link/ipfs/${ipfsHash}` },
  ];
  
  // Check for Polygon Testnet explorer if token ID exists
  const polygonExplorer = tokenId 
    ? `https://www.oklink.com/amoy/address/0xd9Aa3fAe83B41f4F9835fB7ab7d087f0c91419ED`
    : null;

  return (
    <div className="mt-6 w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
        {isOpen ? 'Hide NFT Storage Info' : 'View NFT in Storage'}
      </button>
      
      {isOpen && (
        <div className="mt-4 p-4 border border-secondary/20 rounded-lg bg-secondary/5">
          <h3 className="text-lg font-medium mb-3">Your NFT in Storage</h3>
          
          <div className="flex flex-col md:flex-row gap-4">
            {/* NFT Image Preview */}
            <div className="md:w-1/2">
              <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden relative">
                <img 
                  src={ipfsGateways[0].url} 
                  alt="NFT Preview"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // If first gateway fails, try next one
                    (e.target as HTMLImageElement).src = ipfsGateways[1].url;
                  }}
                />
              </div>
            </div>
            
            {/* NFT Links and Info */}
            <div className="md:w-1/2 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">IPFS Hash:</h4>
                <p className="text-xs bg-secondary/10 p-2 rounded break-all">
                  {ipfsHash}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">View on IPFS Gateways:</h4>
                <div className="flex flex-wrap gap-2">
                  {ipfsGateways.map((gateway) => (
                    <a
                      key={gateway.name}
                      href={gateway.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-2 py-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded transition-colors"
                    >
                      {gateway.name}
                    </a>
                  ))}
                </div>
              </div>
              
              {tokenId && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">NFT Token ID:</h4>
                  <p className="text-xs bg-secondary/10 p-2 rounded break-all">
                    {tokenId}
                  </p>
                </div>
              )}
              
              {polygonExplorer && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">View on Chain:</h4>
                  <a
                    href={polygonExplorer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs px-2 py-1 bg-primary hover:bg-primary/80 text-primary-foreground rounded transition-colors"
                  >
                    Polygon Amoy Explorer
                  </a>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 text-xs text-muted-foreground">
            <p className="mb-1">⚠️ Note: IPFS gateways may take a few minutes to propagate your NFT.</p>
            <p>If one gateway doesn't work, try another from the list above.</p>
          </div>
        </div>
      )}
    </div>
  );
} 
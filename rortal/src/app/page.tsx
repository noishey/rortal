'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ConnectButton from './components/ConnectButton';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Hamburger Navigation */}
      <section className="relative min-h-screen flex flex-col">
        {/* Mobile-First Header with Hamburger */}
        <header className="flex justify-between items-center p-4 sm:p-6 relative z-50">
          <h1 className="text-xl font-bold sm:text-2xl">Rortal</h1>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#showcase" className="hover:text-blue-400 transition-colors">Showcase</a>
            <a href="#creators" className="hover:text-blue-400 transition-colors">Creators</a>
            <a href="#discover" className="hover:text-blue-400 transition-colors">Discover</a>
            <a href="#how-it-works" className="hover:text-blue-400 transition-colors">How It Works</a>
          </nav>
          
          {/* Mobile Hamburger Menu */}
          <div className="lg:hidden flex items-center space-x-4">
            <ConnectButton />
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
                <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
              </div>
            </button>
          </div>
          
          {/* Desktop Connect Button */}
          <div className="hidden lg:block">
            <ConnectButton />
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-95 z-40 pt-20">
            <nav className="flex flex-col items-center space-y-8 text-xl">
              <a href="#showcase" onClick={() => setIsMenuOpen(false)} className="hover:text-blue-400 transition-colors">Showcase</a>
              <a href="#creators" onClick={() => setIsMenuOpen(false)} className="hover:text-blue-400 transition-colors">Top Creators</a>
              <a href="#discover" onClick={() => setIsMenuOpen(false)} className="hover:text-blue-400 transition-colors">Discover NFTs</a>
              <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="hover:text-blue-400 transition-colors">How It Works</a>
            </nav>
          </div>
        )}

        {/* Hero Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6">
          <div className="text-center max-w-sm mx-auto sm:max-w-2xl lg:max-w-4xl">
            <h2 className="text-3xl font-bold mb-4 sm:text-4xl lg:text-5xl xl:text-6xl sm:mb-6 leading-tight">
              Create AI-Powered NFTs
            </h2>
            <p className="text-base text-gray-400 mb-8 sm:text-lg lg:text-xl sm:mb-10 leading-relaxed max-w-2xl mx-auto">
              Generate unique digital art using AI and mint it as an NFT on the blockchain. Join the future of digital creativity.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-center">
              <Link 
                href="/mint-nft"
                className="block w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-4 px-8 rounded-lg transition-colors text-center sm:w-auto"
              >
                Start Creating
              </Link>
              <a 
                href="#showcase"
                className="block w-full border border-white/20 hover:border-white/40 text-white font-semibold py-4 px-8 rounded-lg transition-colors text-center sm:w-auto"
              >
                Explore Gallery
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section id="showcase" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl font-bold mb-4 sm:text-3xl lg:text-4xl">Featured Artwork</h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              Discover amazing AI-generated NFTs created by our community
            </p>
          </div>
          
          {/* Mobile-First Gallery Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
                <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-white font-semibold">
                    AI Art #{item}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">Digital Dreams #{item}</h3>
                  <p className="text-gray-400 text-sm mb-3">by Creator{item}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-400 font-semibold">0.{item} ETH</span>
                    <button className="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition-colors">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Creators Section */}
      <section id="creators" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl font-bold mb-4 sm:text-3xl lg:text-4xl">Top Creators</h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              Meet the artists pushing the boundaries of AI-generated art
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((creator) => (
              <div key={creator} className="bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-700 transition-colors">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                  C{creator}
                </div>
                <h3 className="font-semibold text-lg mb-2">Creator {creator}</h3>
                <p className="text-gray-400 text-sm mb-4">Digital Artist & AI Enthusiast</p>
                <div className="flex justify-center space-x-6 text-sm">
                  <div>
                    <div className="font-semibold text-blue-400">{creator * 15}</div>
                    <div className="text-gray-400">NFTs</div>
                  </div>
                  <div>
                    <div className="font-semibold text-green-400">{creator * 2.5} ETH</div>
                    <div className="text-gray-400">Volume</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Create & Mint Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 sm:text-3xl lg:text-4xl">Create & Mint Your NFT</h2>
          <p className="text-gray-400 text-base sm:text-lg mb-12 max-w-2xl mx-auto">
            Transform your ideas into unique digital assets with our AI-powered creation tools
          </p>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                🎨
              </div>
              <h3 className="font-semibold mb-2">Generate</h3>
              <p className="text-gray-400 text-sm">Use AI to create unique artwork from your prompts</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                ⚡
              </div>
              <h3 className="font-semibold mb-2">Mint</h3>
              <p className="text-gray-400 text-sm">Turn your art into an NFT on the blockchain</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                💎
              </div>
              <h3 className="font-semibold mb-2">Trade</h3>
              <p className="text-gray-400 text-sm">List and sell your NFTs on marketplaces</p>
            </div>
          </div>
          
          <Link 
            href="/mint-nft"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-lg transition-all transform hover:scale-105"
          >
            Start Creating Now
          </Link>
        </div>
      </section>

      {/* Discover NFTs Section */}
      <section id="discover" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl font-bold mb-4 sm:text-3xl lg:text-4xl">Discover NFTs</h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              Explore the latest trends and collections in the NFT space
            </p>
          </div>
          
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {['All', 'Art', 'Photography', 'Music', 'Gaming', 'Sports'].map((category) => (
              <button 
                key={category}
                className="px-4 py-2 bg-gray-800 hover:bg-blue-600 rounded-full text-sm transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Trending Collections */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((collection) => (
              <div key={collection} className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
                <div className="aspect-video bg-gradient-to-br from-pink-500 to-orange-500 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-white font-semibold">
                    Collection {collection}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">Trending Collection #{collection}</h3>
                  <p className="text-gray-400 text-sm mb-3">{collection * 100} items</p>
                  <div className="text-blue-400 font-semibold">Floor: {collection}.{collection} ETH</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl font-bold mb-4 sm:text-3xl lg:text-4xl">How It Works</h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              Get started with AI-powered NFT creation in just a few simple steps
            </p>
          </div>
          
          <div className="space-y-8 sm:space-y-12">
            {[
              { step: 1, title: 'Connect Your Wallet', desc: 'Link your crypto wallet to get started with minting and trading' },
              { step: 2, title: 'Generate AI Art', desc: 'Use our AI tools to create unique artwork from text prompts' },
              { step: 3, title: 'Mint as NFT', desc: 'Transform your creation into a blockchain-verified NFT' },
              { step: 4, title: 'List & Sell', desc: 'Share your NFT with the world and start earning' }
            ].map((item) => (
              <div key={item.step} className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Rortal</h3>
              <p className="text-gray-400 text-sm mb-4">
                The future of AI-powered NFT creation and trading.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Discord</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Marketplace</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Explore</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Create</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Collections</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 Rortal. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
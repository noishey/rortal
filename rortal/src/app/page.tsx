'use client'; // Enable client-side rendering

import { useState } from 'react'; // Import useState hook for component state
import Link from 'next/link'; // Import Next.js Link component for navigation
import Image from 'next/image'; // Import Next.js optimized Image component
import ConnectButton from './components/ConnectButton'; // Import wallet connection button

export default function HomePage() { // Main homepage component
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu toggle

  return (
    <div className="min-h-screen bg-black text-white"> {/* Full height container with dark theme */}
      {/* Hero Section with Hamburger Navigation */}
      <section className="relative min-h-screen flex flex-col"> {/* Hero section taking full viewport height */}
        {/* Mobile-First Header with Hamburger */}
        <header className="flex justify-between items-center p-4 sm:p-6 relative z-50"> {/* Header with responsive padding and high z-index */}
          <h1 className="text-xl font-bold sm:text-2xl">Rortal</h1> {/* Site logo/title with responsive sizing */}
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8"> {/* Desktop navigation hidden on mobile */}
            <a href="#showcase" className="hover:text-blue-400 transition-colors">Showcase</a> {/* Navigation link with hover effect */}
            <a href="#creators" className="hover:text-blue-400 transition-colors">Creators</a> {/* Navigation link */}
            <a href="#discover" className="hover:text-blue-400 transition-colors">Discover</a> {/* Navigation link */}
            <a href="#how-it-works" className="hover:text-blue-400 transition-colors">How It Works</a> {/* Navigation link */}
          </nav>
          
          {/* Mobile Hamburger Menu */}
          <div className="lg:hidden flex items-center space-x-4"> {/* Mobile menu container */}
            <ConnectButton /> {/* Wallet connection button for mobile */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle mobile menu state
              className="p-2 rounded-md hover:bg-gray-800 transition-colors" // Hamburger button styling
              aria-label="Toggle menu" // Accessibility label
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center"> {/* Hamburger icon container */}
                <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span> {/* Top hamburger line with animation */}
                <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span> {/* Middle hamburger line */}
                <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span> {/* Bottom hamburger line */}
              </div>
            </button>
          </div>
          
          {/* Desktop Connect Button */}
          <div className="hidden lg:block"> {/* Desktop wallet button container */}
            <ConnectButton /> {/* Wallet connection button for desktop */}
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && ( // Conditionally render mobile menu
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-95 z-40 pt-20"> {/* Full screen overlay */}
            <nav className="flex flex-col items-center space-y-8 text-xl"> {/* Mobile navigation menu */}
              <a href="#showcase" onClick={() => setIsMenuOpen(false)} className="hover:text-primary transition-colors">Showcase</a> {/* Mobile nav link */}
              <a href="#creators" onClick={() => setIsMenuOpen(false)} className="hover:text-primary transition-colors">Top Creators</a> {/* Mobile nav link */}
              <a href="#discover" onClick={() => setIsMenuOpen(false)} className="hover:text-primary transition-colors">Discover NFTs</a> {/* Mobile nav link */}
              <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="hover:text-primary transition-colors">How It Works</a> {/* Mobile nav link */}
            </nav>
          </div>
        )}

        {/* Hero Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6"> {/* Hero content container */}
          <div className="text-center max-w-sm mx-auto sm:max-w-2xl lg:max-w-4xl"> {/* Responsive content wrapper */}
            <h2 className="text-3xl font-bold mb-4 sm:text-4xl lg:text-5xl xl:text-6xl sm:mb-6 leading-tight"> {/* Main hero heading with responsive sizing */}
              Create AI-Powered NFTs
            </h2>
            <p className="text-base text-gray-400 mb-8 sm:text-lg lg:text-xl sm:mb-10 leading-relaxed max-w-2xl mx-auto"> {/* Hero description */}
              Generate unique digital art using AI and mint it as an NFT on the blockchain. Join the future of digital creativity.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-center"> {/* CTA button container */}
              <Link 
                href="/mint-nft" // Navigate to NFT minting page
                className="block w-full bg-[#4b871c] hover:bg-[#4b871c]/90 active:bg-[#4b871c]/80 text-white font-semibold py-4 px-8 rounded-lg transition-colors text-center sm:w-auto" // Primary CTA button styling
              >
                Start Creating {/* Primary call-to-action text */}
              </Link>
              <a 
                href="#showcase" // Scroll to showcase section
                className="block w-full border border-white/20 hover:border-white/40 text-white font-semibold py-4 px-8 rounded-lg transition-colors text-center sm:w-auto" // Secondary CTA button styling
              >
                Explore Gallery {/* Secondary call-to-action text */}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section id="showcase" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6"> {/* Featured artwork section */}
        <div className="max-w-6xl mx-auto"> {/* Container with max width */}
          <div className="text-center mb-12 sm:mb-16"> {/* Section header */}
            <h2 className="text-2xl font-bold mb-4 sm:text-3xl lg:text-4xl">Featured Artwork</h2> {/* Section title */}
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto"> {/* Section description */}
              Discover amazing AI-generated NFTs created by our community
            </p>
          </div>
          
          {/* Mobile-First Gallery Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"> {/* Responsive grid layout */}
            {[1, 2, 3, 4, 5, 6].map((item) => ( // Generate 6 placeholder NFT cards
              <div key={item} className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300"> {/* NFT card with hover animation */}
                <div className="aspect-square bg-gradient-to-br from-gray-800 to-black relative"> {/* Square image placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center text-white font-semibold"> {/* Centered placeholder text */}
                    AI Art #{item} {/* Placeholder artwork title */}
                  </div>
                </div>
                <div className="p-4"> {/* Card content area */}
                  <h3 className="font-semibold mb-2">Digital Dreams #{item}</h3> {/* NFT title */}
                  <p className="text-gray-400 text-sm mb-3">by Creator{item}</p> {/* Creator name */}
                  <div className="flex justify-between items-center"> {/* Price and action row */}
                    <span className="text-primary font-semibold">0.{item} ETH</span> {/* NFT price */}
                    <button className="text-xs bg-primary hover:bg-primary/90 px-3 py-1 rounded transition-colors text-white"> {/* View button */}
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
      <section id="creators" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-gray-900/50"> {/* Creators showcase section */}
        <div className="max-w-6xl mx-auto"> {/* Container */}
          <div className="text-center mb-12 sm:mb-16"> {/* Section header */}
            <h2 className="text-2xl font-bold mb-4 sm:text-3xl lg:text-4xl">Top Creators</h2> {/* Section title */}
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto"> {/* Section description */}
              Meet the artists pushing the boundaries of AI-generated art
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"> {/* Creator cards grid */}
            {[1, 2, 3].map((creator) => ( // Generate 3 creator cards
              <div key={creator} className="bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-700 transition-colors"> {/* Creator card */}
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl"> {/* Creator avatar */}
                  C{creator} {/* Creator initial */}
                </div>
                <h3 className="font-semibold text-lg mb-2">Creator {creator}</h3> {/* Creator name */}
                <p className="text-gray-400 text-sm mb-4">Digital Artist & AI Enthusiast</p> {/* Creator description */}
                <div className="flex justify-center space-x-6 text-sm"> {/* Creator stats */}
                  <div> {/* NFT count stat */}
                    <div className="font-semibold text-blue-400">{creator * 15}</div> {/* Dynamic NFT count */}
                    <div className="text-gray-400">NFTs</div> {/* Stat label */}
                  </div>
                  <div> {/* Volume stat */}
                    <div className="font-semibold text-green-400">{creator * 2.5} ETH</div> {/* Dynamic volume */}
                    <div className="text-gray-400">Volume</div> {/* Stat label */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Create & Mint Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6"> {/* How to create section */}
        <div className="max-w-4xl mx-auto text-center"> {/* Centered container */}
          <h2 className="text-2xl font-bold mb-4 sm:text-3xl lg:text-4xl">Create & Mint Your NFT</h2> {/* Section title */}
          <p className="text-gray-400 text-base sm:text-lg mb-12 max-w-2xl mx-auto"> {/* Section description */}
            Transform your ideas into unique digital assets with our AI-powered creation tools
          </p>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 mb-12"> {/* Process steps grid */}
            <div className="text-center"> {/* Step 1 */}
              <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl"> {/* Step icon */}
                🎨 {/* Art emoji */}
              </div>
              <h3 className="font-semibold mb-2">Generate</h3> {/* Step title */}
              <p className="text-gray-400 text-sm">Use AI to create unique artwork from your prompts</p> {/* Step description */}
            </div>
            <div className="text-center"> {/* Step 2 */}
              <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl"> {/* Step icon */}
                ⚡ {/* Lightning emoji */}
              </div>
              <h3 className="font-semibold mb-2">Mint</h3> {/* Step title */}
              <p className="text-gray-400 text-sm">Turn your art into an NFT on the blockchain</p> {/* Step description */}
            </div>
            <div className="text-center"> {/* Step 3 */}
              <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl"> {/* Step icon */}
                💎 {/* Diamond emoji */}
              </div>
              <h3 className="font-semibold mb-2">Trade</h3> {/* Step title */}
              <p className="text-gray-400 text-sm">List and sell your NFTs on marketplaces</p> {/* Step description */}
            </div>
          </div>
          
          <Link 
            href="/mint-nft" // Navigate to minting page
            className="inline-block bg-[#4b871c] hover:bg-[#4b871c]/90 text-white font-semibold py-4 px-8 rounded-lg transition-all transform hover:scale-105" // CTA button with hover animation
          >
            Start Creating Now {/* Call-to-action text */}
          </Link>
        </div>
      </section>

      {/* Discover NFTs Section */}
      <section id="discover" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-gray-900/50"> {/* NFT discovery section */}
        <div className="max-w-6xl mx-auto"> {/* Container */}
          <div className="text-center mb-12 sm:mb-16"> {/* Section header */}
            <h2 className="text-2xl font-bold mb-4 sm:text-3xl lg:text-4xl">Discover NFTs</h2> {/* Section title */}
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto"> {/* Section description */}
              Explore the latest trends and collections in the NFT space
            </p>
          </div>
          
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12"> {/* Filter buttons container */}
            {['All', 'Art', 'Photography', 'Music', 'Gaming', 'Sports'].map((category) => ( // Category filter buttons
              <button 
                key={category} // Unique key for each button
                className="px-4 py-2 bg-gray-800 hover:bg-blue-600 rounded-full text-sm transition-colors" // Filter button styling
              >
                {category} {/* Category name */}
              </button>
            ))}
          </div>
          
          {/* Trending Collections */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"> {/* Collections grid */}
            {[1, 2, 3, 4].map((collection) => ( // Generate 4 collection cards
              <div key={collection} className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300"> {/* Collection card */}
                <div className="aspect-video bg-gradient-to-br from-gray-600 to-gray-900 relative"> {/* Collection image placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center text-white font-semibold"> {/* Centered text */}
                    Collection {collection} {/* Collection name */}
                  </div>
                </div>
                <div className="p-4"> {/* Card content */}
                  <h3 className="font-semibold mb-2">Trending Collection #{collection}</h3> {/* Collection title */}
                  <p className="text-gray-400 text-sm mb-3">{collection * 100} items</p> {/* Item count */}
                  <div className="text-primary font-semibold">Floor: {collection}.{collection} ETH</div> {/* Floor price */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6"> {/* Tutorial section */}
        <div className="max-w-4xl mx-auto"> {/* Container */}
          <div className="text-center mb-12 sm:mb-16"> {/* Section header */}
            <h2 className="text-2xl font-bold mb-4 sm:text-3xl lg:text-4xl">How It Works</h2> {/* Section title */}
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto"> {/* Section description */}
              Get started with AI-powered NFT creation in just a few simple steps
            </p>
          </div>
          
          <div className="space-y-8 sm:space-y-12"> {/* Steps container */}
            {[ // Array of step objects
              { step: 1, title: 'Connect Your Wallet', desc: 'Link your crypto wallet to get started with minting and trading' },
              { step: 2, title: 'Generate AI Art', desc: 'Use our AI tools to create unique artwork from text prompts' },
              { step: 3, title: 'Mint as NFT', desc: 'Transform your creation into a blockchain-verified NFT' },
              { step: 4, title: 'List & Sell', desc: 'Share your NFT with the world and start earning' }
            ].map((item) => ( // Map through steps
              <div key={item.step} className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6"> {/* Step container */}
                <div className="flex-shrink-0 w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center font-bold text-lg"> {/* Step number circle */}
                  {item.step} {/* Step number */}
                </div>
                <div className="flex-1"> {/* Step content */}
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3> {/* Step title */}
                  <p className="text-gray-400">{item.desc}</p> {/* Step description */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 sm:py-16 px-4 sm:px-6"> {/* Site footer */}
        <div className="max-w-6xl mx-auto"> {/* Footer container */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-8"> {/* Footer links grid */}
            <div> {/* Company info column */}
              <h3 className="font-bold text-lg mb-4">Rortal</h3> {/* Company name */}
              <p className="text-gray-400 text-sm mb-4"> {/* Company description */}
                The future of AI-powered NFT creation and trading.
              </p>
              <div className="flex space-x-4"> {/* Social links */}
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a> {/* Twitter link */}
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Discord</a> {/* Discord link */}
              </div>
            </div>
            
            <div> {/* Marketplace links column */}
              <h4 className="font-semibold mb-4">Marketplace</h4> {/* Column title */}
              <ul className="space-y-2 text-sm text-gray-400"> {/* Links list */}
                <li><a href="#" className="hover:text-white transition-colors">Explore</a></li> {/* Explore link */}
                <li><a href="#" className="hover:text-white transition-colors">Create</a></li> {/* Create link */}
                <li><a href="#" className="hover:text-white transition-colors">Collections</a></li> {/* Collections link */}
              </ul>
            </div>
            
            <div> {/* Resources links column */}
              <h4 className="font-semibold mb-4">Resources</h4> {/* Column title */}
              <ul className="space-y-2 text-sm text-gray-400"> {/* Links list */}
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li> {/* Help link */}
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li> {/* Blog link */}
                <li><a href="#" className="hover:text-white transition-colors">API</a></li> {/* API link */}
              </ul>
            </div>
            
            <div> {/* Company links column */}
              <h4 className="font-semibold mb-4">Company</h4> {/* Column title */}
              <ul className="space-y-2 text-sm text-gray-400"> {/* Links list */}
                <li><a href="#" className="hover:text-white transition-colors">About</a></li> {/* About link */}
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li> {/* Careers link */}
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li> {/* Contact link */}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0"> {/* Footer bottom */}
            <p className="text-gray-400 text-sm"> {/* Copyright notice */}
              © 2024 Rortal. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400"> {/* Legal links */}
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a> {/* Privacy link */}
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a> {/* Terms link */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
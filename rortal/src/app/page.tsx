"use client"

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import MintButton from "@/app/components/MintButton";
import MintedNFT from "./components/MintedNFT";
import AudioPlayer from "./components/AudioPlayer";
import StableDiffusion from "./components/StableDiffusion";
import MintNFT from './components/MintNFT';

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mintedTokenId, setMintedTokenId] = useState<string | null>(null);
  const viewportRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentViewport, setCurrentViewport] = useState(0);

  useEffect(() => {
    // Set initial theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
    } else {
      document.documentElement.classList.add('light');
    }
    
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Handle scroll events
    const handleScroll = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY;
      const currentScroll = window.scrollX;
      const viewportWidth = window.innerWidth;
      const scrollAmount = Math.abs(delta) > 50 ? viewportWidth : viewportWidth / 2;
      const nextScroll = delta > 0 
        ? Math.min(currentScroll + scrollAmount, viewportWidth * 4) // Limit to last viewport
        : Math.max(currentScroll - scrollAmount, 0); // Don't go below 0
      
      window.scrollTo({
        left: nextScroll,
        behavior: 'smooth'
      });
    };

    // Intersection Observer for viewport animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100');
          } else {
            entry.target.classList.remove('opacity-100');
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe all viewports
    viewportRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    window.addEventListener('wheel', handleScroll, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleScroll);
      observer.disconnect();
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Remove all theme classes
    document.documentElement.classList.remove('light', 'dark');
    // Add the new theme class
    document.documentElement.classList.add(newTheme);
  };

  return (
    <main className="flex flex-row w-[500vw] h-screen bg-background text-foreground overflow-x-hidden">
      <AudioPlayer />
      
      {/* Theme Switcher */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 rounded-full bg-secondary/20 hover:bg-secondary/30 transition-colors z-50"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2"/>
            <path d="M12 20v2"/>
            <path d="m4.93 4.93 1.41 1.41"/>
            <path d="m17.66 17.66 1.41 1.41"/>
            <path d="M2 12h2"/>
            <path d="M20 12h2"/>
            <path d="m6.34 17.66-1.41 1.41"/>
            <path d="m19.07 4.93-1.41 1.41"/>
          </svg>
        )}
      </button>
      
      {/* Viewport 1 */}
      <div 
        ref={el => { if (el) viewportRefs.current[0] = el }}
        className="w-screen h-screen flex items-center justify-center p-8 snap-start opacity-0 transition-opacity duration-1000"
      >
        <div className="flex flex-row items-center justify-between w-full max-w-6xl gap-12">
          {/* Left text - takes up half the width */}
          <div className="typing-container w-1/2">
            <h1 className="text-[8rem] font-black mb-4 typing-text">
              ((( r )))
            </h1>
            <p className="text-6xl font-bold typing-text glitch-text" data-text="&ldquo;leave a mark&rdquo;" style={{ animationDelay: '3.5s' }}>
              &ldquo;leave a mark&rdquo;
            </p>
          </div>

          {/* Right image - takes up half the width */}
          <div className="breathing-image grayscale hover:grayscale-0 transition-all duration-500 w-1/2 flex justify-center">
            <Image
              src="/22.png"
              alt="Your Image"
              width={400}
              height={400}
              objectFit="cover"
            />
          </div>
        </div>
      </div>

      {/* Viewport 2 */}
      <div 
        ref={el => { if (el) viewportRefs.current[1] = el }}
        className="w-screen h-screen flex items-center justify-center p-8 snap-start opacity-0 transition-opacity duration-1000"
      >
        <div className="w-full max-w-6xl">
          <StableDiffusion />
        </div>
      </div>

      {/* Viewport 3 */}
      <div 
        ref={el => { if (el) viewportRefs.current[2] = el }}
        className="w-screen h-screen flex items-center justify-center p-8 snap-start opacity-0 transition-opacity duration-1000"
      >
        <div className="flex flex-col gap-4 items-center">
          {!mintedTokenId ? (
            <MintButton onMintSuccess={setMintedTokenId} />
          ) : (
            <MintedNFT tokenId={mintedTokenId} />
          )}
        </div>
      </div>

      {/* Viewport 4 */}
      <div 
        ref={el => { if (el) viewportRefs.current[3] = el }}
        className="w-screen h-screen flex items-center justify-center p-8 snap-start opacity-0 transition-opacity duration-1000"
      >
        {/* Viewport 4 grid layout with 1:1 grids */}
        <div className="w-full max-w-6xl">
          <p>Gallery</p>
        </div>
      </div>

      {/* Last viewport - Combined Icons */}
      <div 
        ref={el => { if (el) viewportRefs.current[4] = el }}
        className="w-screen h-screen snap-start flex items-center justify-center p-8 opacity-0 transition-opacity duration-1000"
      >
        <div className="flex flex-col items-center gap-12">
          {/* Buy Me A Coffee Row */}
          <div className="flex flex-row gap-12">
            <button className="bg-secondary text-secondary-foreground p-4 rounded-lg font-medium hover:bg-opacity-90 transition-colors hover:scale-110 transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                <path d="M6 1v4"/>
                <path d="M10 1v4"/>
                <path d="M14 1v4"/>
                <path d="M18 1v4"/>
              </svg>
            </button>
            <button className="bg-foreground text-background p-4 rounded-lg font-medium hover:bg-opacity-90 transition-colors hover:scale-110 transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="12" r="6"/>
                <circle cx="16" cy="12" r="6"/>
                <path d="M8 12h8"/>
              </svg>
            </button>
            <button className="bg-secondary text-secondary-foreground p-4 rounded-lg font-medium hover:bg-opacity-90 transition-colors hover:scale-110 transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
            </button>
          </div>

          {/* Social Media Icons */}
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-4xl font-bold">Connect</h2>
            <div className="flex gap-6">
              {/* Twitter */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                </svg>
              </a>

              {/* Discord */}
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  <path d="M17 8l-5 5-5-5"/>
                </svg>
              </a>

              {/* Mirror */}
              <a
                href="https://mirror.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M12 8v8"/>
                  <path d="M8 12h8"/>
                </svg>
              </a>

              {/* XYZ */}
              <a
                href="https://xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
              </a>

              {/* Medium */}
              <a
                href="https://medium.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 20h.01"/>
                  <path d="M7 20v-4"/>
                  <path d="M12 20V8"/>
                  <path d="M17 20V4"/>
                  <path d="M22 20v-12"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

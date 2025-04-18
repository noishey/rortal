"use client";

import { useEffect, useRef, useState } from 'react';

export default function ScrollSound() {
  const forwardScrollSoundRef = useRef<HTMLAudioElement>(null);
  const backwardScrollSoundRef = useRef<HTMLAudioElement>(null);
  const endScrollSoundRef = useRef<HTMLAudioElement>(null);
  const prevScrollX = useRef<number>(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const totalScrollWidth = useRef<number>(0);

  // Initialize total scroll width
  useEffect(() => {
    const updateTotalWidth = () => {
      totalScrollWidth.current = document.documentElement.scrollWidth - window.innerWidth;
    };
    
    updateTotalWidth();
    window.addEventListener('resize', updateTotalWidth);
    
    return () => {
      window.removeEventListener('resize', updateTotalWidth);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return; // Don't trigger new sounds while already scrolling
      
      const currentScrollX = window.scrollX;
      const viewportWidth = window.innerWidth;
      const scrollDifference = currentScrollX - prevScrollX.current;
      
      // Check if we've reached the end (95% or more of scroll)
      const scrollPercentage = totalScrollWidth.current > 0 ? 
        (currentScrollX / totalScrollWidth.current) * 100 : 0;
      
      const isNearEnd = scrollPercentage >= 95;
      
      // Play end sound if we've reached the end for the first time
      if (isNearEnd && !hasReachedEnd && endScrollSoundRef.current) {
        endScrollSoundRef.current.currentTime = 0;
        endScrollSoundRef.current.play()
          .catch(e => console.error("Error playing end scroll sound:", e));
        setHasReachedEnd(true);
      } else if (!isNearEnd && hasReachedEnd) {
        // Reset end flag when scrolling away from end
        setHasReachedEnd(false);
      }
      
      // Only play direction sounds when scrolling a significant amount
      if (Math.abs(scrollDifference) > viewportWidth / 4) {
        // Scrolling forward (right)
        if (scrollDifference > 0 && forwardScrollSoundRef.current) {
          forwardScrollSoundRef.current.currentTime = 0;
          forwardScrollSoundRef.current.play()
            .catch(e => console.error("Error playing forward scroll sound:", e));
          setIsScrolling(true);
        } 
        // Scrolling backward (left)
        else if (scrollDifference < 0 && backwardScrollSoundRef.current) {
          backwardScrollSoundRef.current.currentTime = 0;
          backwardScrollSoundRef.current.play()
            .catch(e => console.error("Error playing backward scroll sound:", e));
          setIsScrolling(true);
        }
        
        // Update the previous scroll position
        prevScrollX.current = currentScrollX;
        
        // Reset the isScrolling state after sound duration
        setTimeout(() => {
          setIsScrolling(false);
        }, 500); // Use a fixed duration 
      }
    };

    // Initialize the previous scroll position
    prevScrollX.current = window.scrollX;
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isScrolling, hasReachedEnd]);

  return (
    <>
      {/* Forward scrolling sound */}
      <audio
        ref={forwardScrollSoundRef}
        src="/audio/scroll-forward.mp3"
        preload="auto"
        className="hidden"
      />
      
      {/* Backward scrolling sound */}
      <audio
        ref={backwardScrollSoundRef}
        src="/audio/scroll-backward.mp3"
        preload="auto"
        className="hidden"
      />
      
      {/* End scroll sound */}
      <audio
        ref={endScrollSoundRef}
        src="/audio/scroll-end.mp3"
        preload="auto"
        className="hidden"
      />
    </>
  );
} 
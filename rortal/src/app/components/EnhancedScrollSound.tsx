"use client";

import { useEffect, useRef, useState } from 'react';

type ScrollSoundConfig = {
  id: string;
  src: string;
  triggerPoint: number; // Percentage (0-100) of the total scroll width
  triggerThreshold: number; // How close to the trigger point to play the sound (in percentage)
  volume?: number; // 0-1
  playOnce?: boolean; // If true, only plays once per session
};

export default function EnhancedScrollSound() {
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const [lastPlayedSoundTime, setLastPlayedSoundTime] = useState<Record<string, number>>({});
  const totalScrollWidth = useRef<number>(0);
  
  // Define sound configurations
  // You can customize or add more sounds as needed
  const scrollSounds: ScrollSoundConfig[] = [
    {
      id: 'scroll-intro',
      src: '/audio/scroll-intro.mp3',
      triggerPoint: 0,
      triggerThreshold: 5,
      volume: 0.8,
      playOnce: true
    },
    {
      id: 'viewport-1',
      src: '/audio/viewport-1.mp3',
      triggerPoint: 20,
      triggerThreshold: 5,
      volume: 0.7
    },
    {
      id: 'viewport-2',
      src: '/audio/viewport-2.mp3',
      triggerPoint: 40,
      triggerThreshold: 5,
      volume: 0.7
    },
    {
      id: 'viewport-3',
      src: '/audio/viewport-3.mp3',
      triggerPoint: 60,
      triggerThreshold: 5,
      volume: 0.7
    },
    {
      id: 'viewport-4',
      src: '/audio/viewport-4.mp3',
      triggerPoint: 80,
      triggerThreshold: 5,
      volume: 0.7
    },
    {
      id: 'scroll-end',
      src: '/audio/scroll-end.mp3',
      triggerPoint: 95,
      triggerThreshold: 5,
      volume: 0.9,
      playOnce: true
    }
  ];

  // Create audio elements for each sound
  useEffect(() => {
    scrollSounds.forEach(sound => {
      const audio = new Audio(sound.src);
      audio.volume = sound.volume || 0.7;
      audio.preload = 'auto';
      audioRefs.current.set(sound.id, audio);
    });

    // Cleanup on unmount
    return () => {
      audioRefs.current.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioRefs.current.clear();
    };
  }, []);

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

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (totalScrollWidth.current <= 0) return;

      const currentScrollX = window.scrollX;
      const scrollPercentage = (currentScrollX / totalScrollWidth.current) * 100;
      const currentTime = Date.now();

      // Check each sound to see if it should be played
      scrollSounds.forEach(sound => {
        const audioElement = audioRefs.current.get(sound.id);
        if (!audioElement) return;

        // Check if we're close to the trigger point
        const isNearTrigger = Math.abs(scrollPercentage - sound.triggerPoint) <= sound.triggerThreshold;
        
        // Check if this sound hasn't been played recently (to prevent multiple plays)
        const lastPlayed = lastPlayedSoundTime[sound.id] || 0;
        const timeSinceLastPlay = currentTime - lastPlayed;
        const canPlayAgain = timeSinceLastPlay > 1000; // Don't play more often than once per second
        
        // Check if this sound can be played again if it's a "play once" sound
        const hasBeenPlayedBefore = lastPlayedSoundTime[sound.id] !== undefined;
        const canPlayOnceSound = !sound.playOnce || !hasBeenPlayedBefore;

        if (isNearTrigger && canPlayAgain && canPlayOnceSound) {
          // Reset and play the sound
          audioElement.currentTime = 0;
          audioElement.play()
            .catch(e => console.error(`Error playing sound ${sound.id}:`, e));
          
          // Update last played time
          setLastPlayedSoundTime(prev => ({
            ...prev,
            [sound.id]: currentTime
          }));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastPlayedSoundTime]);

  // This component doesn't render anything visible
  return null;
} 
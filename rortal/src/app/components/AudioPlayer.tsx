"use client"

import { useEffect, useRef } from 'react';

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      // Set the start time to 1:28:00 (5280 seconds)
      audioRef.current.currentTime = 5280;
      // Set the end time to 1:28:30 (5290 seconds)
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current && audioRef.current.currentTime >= 5290) {
          audioRef.current.currentTime = 5280;
        }
      });
    }
  }, []);

  return (
    <audio
      ref={audioRef}
      src="/background.mp3"
      loop
      autoPlay
      className="hidden"
    />
  );
} 
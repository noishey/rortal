"use client"

import { useState, useEffect, useRef } from 'react';

export default function AudioPlayer() {
  // Create a reference to the audio element
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);

  // Effect to check if audio exists and handle browser autoplay policies
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Add event listeners to track audio state
    const handleCanPlay = () => {
      console.log("Audio file loaded and can play");
      setAudioLoaded(true);
    };

    const handleError = (e: ErrorEvent) => {
      console.error("Audio error:", e);
      setAudioLoaded(false);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    // Register event listeners
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError as EventListener);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // Check if the file exists
    fetch('/bgm.mp3')
      .then(response => {
        if (!response.ok) {
          console.error("Audio file not found:", response.status);
          setAudioLoaded(false);
        }
      })
      .catch(err => {
        console.error("Failed to check audio file:", err);
        setAudioLoaded(false);
      });

    // Cleanup
    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError as EventListener);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  useEffect(() => {
    console.log("Audio loaded state:", audioLoaded);
  }, [audioLoaded]);

  // Function to toggle play/pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play()
        .then(() => console.log("Audio playing"))
        .catch(err => console.error("Failed to play audio:", err));
    } else {
      audio.pause();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <audio
        ref={audioRef}
        src="/synthbgm.mp3"
        loop
        preload="auto"
        className="hidden"
      />
      
      {audioLoaded && (
        <button
          onClick={togglePlay}
          className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-full shadow-lg"
          title={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? (
            // Pause icon
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            // Play icon
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </button>
      )}
    </div>
  );
} 
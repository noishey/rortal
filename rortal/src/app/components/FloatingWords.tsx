"use client"

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface FloatingWordsProps {
  words: string[];
  selectedWords: string[];
  onWordClick: (word: string) => void;
}

// Function to generate random darker colors
const getRandomDarkColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
  const lightness = Math.floor(Math.random() * 20) + 20; // 20-40%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export default function FloatingWords({ words, selectedWords, onWordClick }: FloatingWordsProps) {
  const [positions, setPositions] = useState<{ [key: string]: { x: number; y: number } }>({});
  const [colors, setColors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Calculate grid positions
    const gridSize = Math.ceil(Math.sqrt(words.length));
    const cellSize = 150; // Size of each grid cell
    const margin = 50; // Margin from edges
    
    const initialPositions = words.reduce((acc, word, index) => {
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      
      // Center the grid
      const offsetX = (gridSize * cellSize) / 2;
      const offsetY = (gridSize * cellSize) / 2;
      
      acc[word] = {
        x: (col * cellSize) - offsetX + margin,
        y: (row * cellSize) - offsetY + margin,
      };
      return acc;
    }, {} as { [key: string]: { x: number; y: number } });
    
    setPositions(initialPositions);

    // Generate random colors for each word
    const wordColors = words.reduce((acc, word) => {
      acc[word] = getRandomDarkColor();
      return acc;
    }, {} as { [key: string]: string });
    
    setColors(wordColors);
  }, [words]);

  return (
    <div className="w-full h-full relative">
      {words.map((word) => (
        <motion.div
          key={word}
          className={`absolute cursor-pointer select-none`}
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            color: selectedWords.includes(word) ? 'hsl(0, 0%, 50%)' : colors[word]
          }}
          animate={{
            x: [
              positions[word]?.x || 0,
              (positions[word]?.x || 0) + (Math.random() * 30 - 15),
              (positions[word]?.x || 0) + (Math.random() * 30 - 15),
              positions[word]?.x || 0
            ],
            y: [
              positions[word]?.y || 0,
              (positions[word]?.y || 0) + (Math.random() * 30 - 15),
              (positions[word]?.y || 0) + (Math.random() * 30 - 15),
              positions[word]?.y || 0
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
          whileHover={{ scale: 1.1 }}
          onClick={() => onWordClick(word)}
        >
          <span className="text-2xl font-medium">{word}</span>
        </motion.div>
      ))}
    </div>
  );
} 
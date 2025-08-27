"use client"

import { useState, useEffect } from 'react';

interface FloatingWordsProps {
  words: string[];
  selectedWords: string[];
  onWordClick: (word: string) => void;
}

const getRandomColor = () => {
  const colors = [
    'text-blue-600', 'text-purple-600', 'text-green-600', 
    'text-red-600', 'text-yellow-600', 'text-pink-600',
    'text-indigo-600', 'text-teal-600'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function FloatingWords({ words, selectedWords, onWordClick }: FloatingWordsProps) {
  const [wordColors, setWordColors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const colors = words.reduce((acc, word) => {
      acc[word] = getRandomColor();
      return acc;
    }, {} as { [key: string]: string });
    setWordColors(colors);
  }, [words]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-6">
      {words.map((word) => (
        <button
          key={word}
          onClick={() => onWordClick(word)}
          className={`
            px-4 py-3 rounded-lg border-2 transition-all duration-200
            hover:scale-105 hover:shadow-md
            ${
              selectedWords.includes(word)
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : `border-gray-200 bg-white hover:border-gray-300 ${wordColors[word] || 'text-gray-700'}`
            }
          `}
        >
          <span className="text-lg font-medium">{word}</span>
        </button>
      ))}
    </div>
  );
}
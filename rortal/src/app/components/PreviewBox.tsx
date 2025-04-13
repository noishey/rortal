// components/PreviewBox.tsx
import React from 'react';

interface PreviewBoxProps {
  imageSrc: string | null;
  isLoading: boolean;
}

const PreviewBox: React.FC<PreviewBoxProps> = ({ imageSrc, isLoading }) => {
  return (
    <div className="mt-4 flex justify-center items-center">
      {isLoading ? (
        <div className="w-64 h-64 bg-gray-300 text-center flex items-center justify-center">
          <p>Generating image...</p>
        </div>
      ) : imageSrc ? (
        <img src={imageSrc} alt="Generated Preview" className="max-w-full h-auto rounded-lg" />
      ) : (
        <div className="w-64 h-64 bg-gray-200 text-center flex items-center justify-center">
          <p>No image available</p>
        </div>
      )}
    </div>
  );
};

export default PreviewBox;

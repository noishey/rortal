import { useState } from "react";

const Sliders: React.FC = () => {
  const [slider1Value, setSlider1Value] = useState<number>(50);
  const [slider2Value, setSlider2Value] = useState<number>(30);
  const [slider3Value, setSlider3Value] = useState<number>(70);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-8">Slider Example</h1>

      {/* Slider 1 */}
      <div className="w-full max-w-lg mb-6">
        <label className="block text-lg font-medium mb-2">Slider 1: {slider1Value}</label>
        <input
          type="range"
          min="0"
          max="100"
          value={slider1Value}
          onChange={(e) => setSlider1Value(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Slider 2 */}
      <div className="w-full max-w-lg mb-6">
        <label className="block text-lg font-medium mb-2">Slider 2: {slider2Value}</label>
        <input
          type="range"
          min="0"
          max="100"
          value={slider2Value}
          onChange={(e) => setSlider2Value(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Slider 3 */}
      <div className="w-full max-w-lg mb-6">
        <label className="block text-lg font-medium mb-2">Slider 3: {slider3Value}</label>
        <input
          type="range"
          min="0"
          max="100"
          value={slider3Value}
          onChange={(e) => setSlider3Value(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Sliders;

import { useEffect, useState } from 'react';

const FitnessTips: React.FC = () => {
  const [animatedTips, setAnimatedTips] = useState<string[]>([]);
  const tips = [
    "Stay hydrated to boost performance.",
    "Include strength training at least twice a week.",
    "Get 7-9 hours of sleep every night for recovery.",
    "Mix up your routine to prevent boredom.",
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setAnimatedTips((prevTips) => [...prevTips, tips[index]]);
      index += 1;
      if (index === tips.length) clearInterval(interval);
    }, 1000); // Adds one tip every second for animation
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-full">
      <h2 className="text-xl text-purple-300 font-semibold mb-4">🏋️‍♀️ Fitness Tips</h2>
      <ul className="text-sm text-gray-300">
        {animatedTips.map((tip, index) => (
          <li
            key={index}
            className="mb-2 transform transition-all duration-500 ease-in-out hover:scale-105 hover:text-purple-400"
            style={{
              animation: `fadeIn 0.5s ease-out ${index * 0.3}s forwards`, // Animation timing
            }}
          >
            - {tip}
          </li>
        ))}
      </ul>
      <style>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default FitnessTips;

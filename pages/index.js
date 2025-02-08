import { useState, useEffect } from 'react';
import PredictionForm from '../components/PredictionForm';
import PredictionHistory from '../components/PredictionHistory';
import Image from 'next/image';

export default function Home() {
  const [quarter, setQuarter] = useState(1);
  const [showPredictions, setShowPredictions] = useState(false);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    // Load predictions from localStorage on mount
    const savedPredictions = JSON.parse(localStorage.getItem('predictions') || '[]');
    setPredictions(savedPredictions);
  }, []);

  const handleQuarterChange = () => {
    setQuarter((prev) => (prev % 4) + 1);
  };

  const handlePredictionSubmit = (prediction) => {
    setPredictions((prev) => [...prev, prediction]);
    // Show a quick toast or feedback
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-wolfpack-red text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-up';
    toast.textContent = `+${prediction.points} points! 🎯`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 2000);
  };

  const togglePredictions = () => {
    setShowPredictions(!showPredictions);
  };

  return (
    <main className="h-[100dvh] w-screen overflow-hidden relative bg-gray-50">
      {/* Stadium Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 h-[125%] w-full">
          <Image
            src="/stadium.png"
            alt="Stadium"
            layout="fill"
            objectFit="cover"
            className="opacity-25"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/30 to-white/70"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col">
        {showPredictions ? (
          <div className="flex-1 flex flex-col h-full">
            <nav className="bg-white/90 backdrop-blur-sm border-b border-wolfpack-red/20 py-3 px-4 sticky top-0">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setShowPredictions(false)}
                  className="px-4 py-2 bg-wolfpack-red text-white text-sm rounded-lg font-semibold shadow-sm hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <span>←</span>
                  <span>Back to Game</span>
                </button>
                <div className="flex items-center space-x-2">
                  <span className="text-wolfpack-red font-semibold">
                    Total Points: {predictions.reduce((sum, p) => sum + p.points, 0)} 🏆
                  </span>
                </div>
              </div>
            </nav>
            <div className="flex-1 overflow-auto p-4 pb-20">
              <PredictionHistory predictions={predictions} />
            </div>
          </div>
        ) : (
          <PredictionForm
            quarter={quarter}
            onSubmit={handlePredictionSubmit}
            onQuarterChange={handleQuarterChange}
            onViewPredictions={togglePredictions}
          />
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out;
        }
        html, body {
          height: 100%;
          overflow: hidden;
        }
      `}</style>
    </main>
  );
}

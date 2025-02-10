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
    toast.textContent = `+${prediction.points} points!`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 2000);
  };

  const togglePredictions = () => {
    setShowPredictions(!showPredictions);
  };

  return (
    <main className="min-h-[100dvh] w-screen overflow-hidden relative">
      {/* Stadium Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 -translate-y-[-7%]">
          <Image
            src="/stadium.png"
            alt="Stadium"
            layout="fill"
            objectFit="cover"
            className="opacity-15"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/80 to-white/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-[100dvh]">
        {showPredictions ? (
          <div className="flex-1 flex flex-col min-h-[100dvh]">
            <nav className="glass-effect border-b border-wolfpack-red/10 py-3 px-4 sticky top-0">
              <div className="flex justify-between items-center max-w-2xl mx-auto">
                <button
                  onClick={() => setShowPredictions(false)}
                  className="btn btn-primary px-4 py-2 flex items-center space-x-2"
                >
                  <span>←</span>
                  <span>Back to Game</span>
                </button>
                <div className="flex items-center space-x-2">
                  <span className="text-wolfpack-red font-semibold">
                    Total Points: {predictions.reduce((sum, p) => sum + p.points, 0)}
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

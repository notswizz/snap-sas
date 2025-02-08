import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function PredictionHistory({ predictions = [] }) {
  const [sortedPredictions, setSortedPredictions] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    // Sort predictions by timestamp (newest first)
    const sorted = [...predictions].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    setSortedPredictions(sorted);
    
    // Calculate total points
    const total = predictions.reduce((sum, p) => sum + p.points, 0);
    setTotalPoints(total);
  }, [predictions]);

  if (sortedPredictions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-xl font-bold text-wolfpack-red mb-2">No Predictions Yet!</h3>
        <p className="text-gray-600 text-center">
          Make your first prediction to start earning points.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-wolfpack-red/10">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-wolfpack-red">Game Stats</h3>
            <p className="text-sm text-gray-600">
              Total Predictions: {sortedPredictions.length}
            </p>
          </div>
          <div className="bg-wolfpack-red/10 px-4 py-2 rounded-lg">
            <span className="text-xl font-bold text-wolfpack-red">
              {totalPoints} Points 🏆
            </span>
          </div>
        </div>
      </div>

      {/* Predictions List */}
      <div className="space-y-3">
        {sortedPredictions.map((prediction) => (
          <div
            key={prediction.id}
            className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-wolfpack-red/10 hover:border-wolfpack-red/20 transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <span className="bg-wolfpack-red text-white text-sm px-2 py-1 rounded-md font-semibold">
                  Q{prediction.quarter}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(prediction.timestamp).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="bg-wolfpack-red/10 px-3 py-1 rounded-full">
                <span className="font-bold text-wolfpack-red">
                  +{prediction.points} pts
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Play Called</p>
                <p className="font-semibold text-gray-800">{prediction.playType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Result</p>
                <p className="font-semibold text-gray-800">{prediction.result}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
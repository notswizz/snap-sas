import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  TrophyIcon,
  ClockIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  FireIcon
} from '@heroicons/react/24/outline';

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

  const getResultIcon = (result) => {
    switch(result) {
      case 'Success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'Fail':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'Touchdown':
        return <FireIcon className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  if (sortedPredictions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 glass-effect rounded-2xl shadow-lg">
        <ChartBarIcon className="w-16 h-16 text-wolfpack-red mb-4" />
        <h3 className="text-xl font-bold text-wolfpack-red mb-2">No Predictions Yet!</h3>
        <p className="text-gray-600 text-center">
          Make your first prediction to start earning points.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Stats Summary */}
      <div className="glass-effect rounded-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-wolfpack-red flex items-center space-x-2">
              <ChartBarIcon className="w-5 h-5" />
              <span>Game Stats</span>
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Total Predictions: {sortedPredictions.length}
            </p>
          </div>
          <div className="glass-effect bg-gradient-to-r from-red-50/50 to-red-100/50 px-4 py-2 rounded-xl flex items-center space-x-2">
            <TrophyIcon className="w-5 h-5 text-wolfpack-red" />
            <span className="text-xl font-bold text-wolfpack-red">
              {totalPoints} Points
            </span>
          </div>
        </div>
      </div>

      {/* Predictions List */}
      <div className="space-y-4">
        {sortedPredictions.map((prediction) => (
          <div
            key={prediction.id}
            className="glass-effect p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <span className="bg-wolfpack-red text-white px-3 py-1.5 rounded-lg font-semibold">
                  Q{prediction.quarter}
                </span>
                <span className="text-sm text-gray-500 flex items-center space-x-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>
                    {new Date(prediction.timestamp).toLocaleTimeString([], {
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </span>
                </span>
              </div>
              <div className="glass-effect bg-gradient-to-r from-red-50/50 to-red-100/50 px-3 py-1.5 rounded-lg flex items-center space-x-1">
                <TrophyIcon className="w-4 h-4 text-wolfpack-red" />
                <span className="font-bold text-wolfpack-red">
                  +{prediction.points}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-2">Play Called</p>
                <p className="font-semibold text-gray-800 flex items-center space-x-2">
                  {prediction.playType}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Result</p>
                <p className="font-semibold text-gray-800 flex items-center space-x-2">
                  {getResultIcon(prediction.result)}
                  <span>{prediction.result}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
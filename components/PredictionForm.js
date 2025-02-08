import { useState } from 'react';
import Image from 'next/image';

const PLAY_TYPES = [
  { value: 'Pass', label: '🏈 Pass', points: 1 },
  { value: 'Run', label: '🏃 Run', points: 1 },
  { value: 'Field Goal', label: '🎯 Field Goal', points: 3 },
];

const RESULTS = [
  { value: 'Success', label: '✅ Success', points: 2 },
  { value: 'Fail', label: '❌ Fail', points: 0 },
  { value: 'Touchdown', label: '🔥 Touchdown', points: 5 },
];

export default function PredictionForm({ quarter, onSubmit, onViewPredictions, onQuarterChange }) {
  const [prediction, setPrediction] = useState({
    playType: '',
    result: '',
    points: 0,
  });

  const calculatePoints = (playType, result) => {
    const playTypeObj = PLAY_TYPES.find(pt => pt.value === playType);
    const resultObj = RESULTS.find(r => r.value === result);
    return (playTypeObj?.points || 0) + (resultObj?.points || 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();
    const points = calculatePoints(prediction.playType, prediction.result);
    const predictionWithMetadata = {
      ...prediction,
      points,
      quarter,
      timestamp,
      id: `${quarter}-${timestamp}`,
    };
    
    const existingPredictions = JSON.parse(localStorage.getItem('predictions') || '[]');
    localStorage.setItem('predictions', JSON.stringify([...existingPredictions, predictionWithMetadata]));
    
    onSubmit(predictionWithMetadata);
    setPrediction({ playType: '', result: '', points: 0 });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm py-3 px-4">
        <div className="flex justify-between items-center">
          <div className="relative w-16 h-8 bg-white rounded-lg p-1">
            <Image
              src="/sas.png"
              alt="SAS Logo"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onQuarterChange}
              className="px-4 py-2 bg-wolfpack-red text-white text-sm rounded-lg font-semibold shadow-sm"
            >
              Q{quarter} 🏈
            </button>
            <button
              onClick={onViewPredictions}
              className="px-4 py-2 bg-white text-wolfpack-red text-sm rounded-lg font-semibold shadow-sm border border-wolfpack-red/20"
            >
              View Stats 📊
            </button>
          </div>
          <div className="relative w-10 h-10">
            <Image
              src="/tuffy.png"
              alt="NC State Tuffy"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
      </nav>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between p-4">
        <div className="space-y-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
            <label className="block text-wolfpack-red font-bold text-lg mb-2">
              What's the next play? 🤔
            </label>
            <select
              value={prediction.playType}
              onChange={(e) => setPrediction({ ...prediction, playType: e.target.value })}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-wolfpack-red focus:border-wolfpack-red bg-white text-lg"
              required
            >
              <option value="">Choose play type</option>
              {PLAY_TYPES.map(({ value, label, points }) => (
                <option key={value} value={value}>{label} (+{points} pts)</option>
              ))}
            </select>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
            <label className="block text-wolfpack-red font-bold text-lg mb-2">
              How will it end? 🎲
            </label>
            <select
              value={prediction.result}
              onChange={(e) => setPrediction({ ...prediction, result: e.target.value })}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-wolfpack-red focus:border-wolfpack-red bg-white text-lg"
              required
            >
              <option value="">Choose outcome</option>
              {RESULTS.map(({ value, label, points }) => (
                <option key={value} value={value}>{label} (+{points} pts)</option>
              ))}
            </select>
          </div>

          <div className="bg-red-50/90 backdrop-blur-sm rounded-xl p-4 text-center border border-wolfpack-red/10">
            <span className="text-xl font-bold text-wolfpack-red">
              Potential Points: {calculatePoints(prediction.playType, prediction.result)} 🏆
            </span>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="w-full bg-wolfpack-red text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg active:transform active:scale-[0.98]"
          >
            Lock In Prediction 🔒
          </button>
        </div>
      </form>
    </div>
  );
} 
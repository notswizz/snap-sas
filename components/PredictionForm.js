import { useState } from 'react';
import Image from 'next/image';
import { 
  ForwardIcon, 
  ArrowPathIcon, 
  TrophyIcon,
  ChartBarIcon,
  LockClosedIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const PLAY_TYPES = [
  { value: 'Pass', label: 'Pass', icon: <ForwardIcon className="w-5 h-5" />, points: 1 },
  { value: 'Run', label: 'Run', icon: <ArrowPathIcon className="w-5 h-5" />, points: 1 },
  { value: 'Field Goal', label: 'Field Goal', icon: <TrophyIcon className="w-5 h-5" />, points: 3 },
];

const RESULTS = [
  { value: 'Success', label: 'Success', color: 'text-green-500', points: 2 },
  { value: 'Fail', label: 'Fail', color: 'text-red-500', points: 0 },
  { value: 'Touchdown', label: 'Touchdown', color: 'text-yellow-500', points: 5 },
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
    <div className="min-h-[100dvh] flex flex-col">
      {/* Top Navigation */}
      <nav className="glass-effect py-3 px-4 sticky top-0 z-50 border-b border-wolfpack-red/10">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <div className="relative w-16 h-8 bg-white/80 rounded-lg p-1">
            <Image
              src="/sas.png"
              alt="SAS Logo"
              layout="fill"
              objectFit="contain"
              className="filter brightness-100"
            />
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onQuarterChange}
              className="btn btn-primary px-4 py-2 flex items-center space-x-2"
            >
              <span>Q{quarter}</span>
              <ForwardIcon className="w-4 h-4" />
            </button>
            <button
              onClick={onViewPredictions}
              className="btn btn-secondary px-4 py-2 flex items-center space-x-2"
            >
              <span>View Stats</span>
              <ChartBarIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="relative w-10 h-10 transform hover:scale-105 transition-transform">
            <Image
              src="/tuffy.png"
              alt="NC State Tuffy"
              layout="fill"
              objectFit="contain"
              className="filter drop-shadow-md"
            />
          </div>
        </div>
      </nav>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between p-4 max-w-2xl mx-auto w-full">
        <div className="space-y-6">
          <div className="glass-effect rounded-2xl p-6 shadow-lg">
            <label className="flex items-center space-x-2 text-wolfpack-red font-bold text-lg mb-4">
              <QuestionMarkCircleIcon className="w-6 h-6" />
              <span>What's the next play?</span>
            </label>
            <select
              value={prediction.playType}
              onChange={(e) => setPrediction({ ...prediction, playType: e.target.value })}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-wolfpack-red focus:border-wolfpack-red bg-white/80 text-lg transition-all"
              required
            >
              <option value="">Choose play type</option>
              {PLAY_TYPES.map(({ value, label, points }) => (
                <option key={value} value={value}>
                  {label} (+{points} pts)
                </option>
              ))}
            </select>
          </div>

          <div className="glass-effect rounded-2xl p-6 shadow-lg">
            <label className="flex items-center space-x-2 text-wolfpack-red font-bold text-lg mb-4">
              <QuestionMarkCircleIcon className="w-6 h-6" />
              <span>How will it end?</span>
            </label>
            <select
              value={prediction.result}
              onChange={(e) => setPrediction({ ...prediction, result: e.target.value })}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-wolfpack-red focus:border-wolfpack-red bg-white/80 text-lg transition-all"
              required
            >
              <option value="">Choose outcome</option>
              {RESULTS.map(({ value, label, points, color }) => (
                <option key={value} value={value} className={color}>
                  {label} (+{points} pts)
                </option>
              ))}
            </select>
          </div>

          <div className="glass-effect rounded-2xl p-6 text-center shadow-inner">
            <div className="flex items-center justify-center space-x-2">
              <TrophyIcon className="w-6 h-6 text-wolfpack-red" />
              <span className="text-xl font-bold text-wolfpack-red">
                Potential Points: {calculatePoints(prediction.playType, prediction.result)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 mb-4">
          <button
            type="submit"
            className="w-full bg-wolfpack-red text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:bg-red-700 active:transform active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
          >
            <LockClosedIcon className="w-5 h-5" />
            <span>Lock In Prediction</span>
          </button>
        </div>
      </form>
    </div>
  );
} 
import { Pause, Play, Heart, Gem, Waves } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface GameUIProps {
  gems: number;
  wave: number;
  baseHealth: number;
  maxBaseHealth: number;
  isPaused: boolean;
  isWaveActive: boolean;
  onPause: () => void;
  onStartWave: () => void;
}

export function GameUI({
  gems,
  wave,
  baseHealth,
  maxBaseHealth,
  isPaused,
  isWaveActive,
  onPause,
  onStartWave,
}: GameUIProps) {
  const healthPercentage = (baseHealth / maxBaseHealth) * 100;
  
  return (
    <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          {/* Gems Counter */}
          <div className="bg-slate-900/90 backdrop-blur rounded-lg px-4 py-2 border border-yellow-500/50 pointer-events-auto">
            <div className="flex items-center gap-2">
              <Gem className="h-5 w-5 text-yellow-400" />
              <span className="text-2xl font-bold text-yellow-400">{gems}</span>
            </div>
          </div>
          
          {/* Wave Counter */}
          <div className="bg-slate-900/90 backdrop-blur rounded-lg px-4 py-2 border border-cyan-500/50 pointer-events-auto">
            <div className="flex items-center gap-2">
              <Waves className="h-5 w-5 text-cyan-400" />
              <span className="text-xl font-bold text-cyan-400">Wave {wave}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          {/* Start Wave Button */}
          {!isWaveActive && (
            <Button
              onClick={onStartWave}
              className="bg-green-600 hover:bg-green-700 text-white pointer-events-auto"
              size="lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Wave
            </Button>
          )}
          
          {/* Pause Button */}
          <Button
            onClick={onPause}
            variant="outline"
            className="bg-slate-900/90 backdrop-blur border-purple-500/50 text-purple-300 hover:bg-purple-900/50 pointer-events-auto"
            size="lg"
          >
            {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Base Health Bar */}
      <div className="mt-4 bg-slate-900/90 backdrop-blur rounded-lg p-3 border border-red-500/50 max-w-xs pointer-events-auto">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="h-5 w-5 text-red-400" />
          <span className="text-white font-bold">Base Health</span>
          <span className="text-red-400 ml-auto">{baseHealth}/{maxBaseHealth}</span>
        </div>
        <Progress 
          value={healthPercentage} 
          className="h-3 bg-slate-800" 
          indicatorClassName={
            healthPercentage > 50 
              ? "bg-green-500" 
              : healthPercentage > 25 
              ? "bg-yellow-500" 
              : "bg-red-500"
          }
        />
      </div>
    </div>
  );
}
import { Trophy, RotateCcw, Home, Skull } from 'lucide-react';
import { Button } from './ui/button';

interface GameOverProps {
  wave: number;
  enemiesKilled: number;
  score: number;
  onRestart: () => void;
  onMainMenu: () => void;
}

export function GameOver({ wave, enemiesKilled, score, onRestart, onMainMenu }: GameOverProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-2xl p-8 max-w-md w-full border-2 border-red-500/50 shadow-2xl">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-red-500/20 rounded-full p-4">
              <Skull className="h-16 w-16 text-red-400" />
            </div>
          </div>
          
          <div>
            <h2 className="text-4xl font-bold text-red-400 mb-2">Game Over</h2>
            <p className="text-purple-300">Your base has been destroyed!</p>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-purple-300">Waves Survived:</span>
              <span className="text-2xl font-bold text-cyan-400">{wave}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-300">Enemies Defeated:</span>
              <span className="text-2xl font-bold text-yellow-400">{enemiesKilled}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-purple-500/30">
              <span className="text-purple-300 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                Final Score:
              </span>
              <span className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {score}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={onRestart}
              size="lg"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Play Again
            </Button>
            
            <Button
              onClick={onMainMenu}
              size="lg"
              variant="outline"
              className="w-full border-purple-400 text-purple-300 hover:bg-purple-900/30"
            >
              <Home className="mr-2 h-5 w-5" />
              Main Menu
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

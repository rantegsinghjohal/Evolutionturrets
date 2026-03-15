import { Play, HelpCircle, Settings } from 'lucide-react';
import { Button } from './ui/button';

interface MainMenuProps {
  onPlay: () => void;
  onHowToPlay: () => void;
}

export function MainMenu({ onPlay, onHowToPlay }: MainMenuProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Evolution Turrets
          </h1>
          <p className="text-xl text-purple-300">
            Defend Your Base. Upgrade Your Arsenal.
          </p>
        </div>
        
        <div className="flex flex-col gap-4 mt-12">
          <Button
            onClick={onPlay}
            size="lg"
            className="text-xl px-12 py-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
          >
            <Play className="mr-2 h-6 w-6" />
            Play Game
          </Button>
          
          <Button
            onClick={onHowToPlay}
            size="lg"
            variant="outline"
            className="text-xl px-12 py-6 border-purple-400 text-purple-300 hover:bg-purple-900/30"
          >
            <HelpCircle className="mr-2 h-6 w-6" />
            How to Play
          </Button>
        </div>
        
        <div className="mt-8 text-sm text-purple-400">
          Wave-based tower defense • Evolve your turrets to Level 6
        </div>

        <div className="mt-4 text-xs text-purple-500/70 tracking-widest uppercase">
          ⚡ Engineered by <span className="text-cyan-400/80 font-semibold">Ranteg Singh Johal</span> — where code meets chaos
        </div>
      </div>
    </div>
  );
}
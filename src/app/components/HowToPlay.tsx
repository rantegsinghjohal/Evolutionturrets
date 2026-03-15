import { ArrowLeft, Target, Zap, Coins, Shield } from 'lucide-react';
import { Button } from './ui/button';

interface HowToPlayProps {
  onBack: () => void;
}

export function HowToPlay({ onBack }: HowToPlayProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-3xl w-full bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-purple-500/30">
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          How to Play
        </h2>
        
        <div className="space-y-6 text-purple-100">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <Target className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-cyan-400 mb-2">Place Turrets</h3>
              <p className="text-purple-200">
                Visit Ranteg's Turret Shop to buy turrets. Choose between Basic Turrets (20 gems - fast firing) 
                or Tank Turrets (50 gems - high damage, slow). Click on the map to place them, avoiding the enemy path.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Zap className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-purple-400 mb-2">Upgrade & Delete Turrets</h3>
              <p className="text-purple-200">
                Click on a turret to select it, then click "Upgrade" to evolve it. 
                Each level increases damage, fire rate, and range. Max level is 10! 
                You can also delete turrets for a 50% gem refund.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Coins className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Earn Gems</h3>
              <p className="text-purple-200">
                Defeat enemies to earn gems: Basic (20), Fast (40), Tank (50), Boss (100). 
                Use gems to buy and upgrade turrets strategically!
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <Shield className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-400 mb-2">Defend Your Base</h3>
              <p className="text-purple-200">
                Don't let enemies reach your base! Each enemy that gets through damages your base. 
                Game over when base health reaches zero.
              </p>
            </div>
          </div>
          
          <div className="bg-purple-900/30 rounded-lg p-4 mt-6">
            <h4 className="font-bold text-purple-300 mb-3">Enemy Types:</h4>
            <ul className="space-y-2 text-sm text-purple-200">
              <li><span className="text-green-400">●</span> <strong>Basic</strong> - Balanced stats, 20 gems reward</li>
              <li><span className="text-yellow-400">●</span> <strong>Fast</strong> - Quick movement but low health, 40 gems</li>
              <li><span className="text-red-400">●</span> <strong>Tank</strong> - High health and slow, 50 gems (spawns wave 4+)</li>
              <li><span className="text-purple-400">●</span> <strong>Boss</strong> - Every 10 waves, massive health, 100 gems!</li>
            </ul>
          </div>
          
          <div className="bg-cyan-900/30 rounded-lg p-4">
            <h4 className="font-bold text-cyan-300 mb-3">Turret Types:</h4>
            <ul className="space-y-2 text-sm text-purple-200">
              <li><span className="text-cyan-400">●</span> <strong>Basic Turret</strong> - 20 gems, fast fire rate, balanced damage</li>
              <li><span className="text-red-400">●</span> <strong>Tank Turret</strong> - 50 gems, high damage, slower fire rate, longer range</li>
            </ul>
            <p className="text-xs text-purple-300 mt-2">💡 Tip: Mix both turret types for optimal defense!</p>
          </div>
        </div>
        
        <Button
          onClick={onBack}
          className="w-full mt-8 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
          size="lg"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Menu
        </Button>
      </div>
    </div>
  );
}
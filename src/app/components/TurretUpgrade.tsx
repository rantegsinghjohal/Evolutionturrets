import { ArrowUp, Gem, X, Zap, Target, Clock, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Turret, TURRET_STATS, TANK_TURRET_STATS } from '../types/game';

interface TurretUpgradeProps {
  turret: Turret;
  gems: number;
  onUpgrade: () => void;
  onClose: () => void;
  onDelete: () => void;
}

export function TurretUpgrade({ turret, gems, onUpgrade, onClose, onDelete }: TurretUpgradeProps) {
  const canUpgrade = turret.level < 10 && gems >= turret.upgradeCost;
  const isMaxLevel = turret.level >= 10;
  
  const statsArray = turret.type === 'basic' ? TURRET_STATS : TANK_TURRET_STATS;
  const currentStats = statsArray[turret.level - 1];
  const nextStats = turret.level < 10 ? statsArray[turret.level] : null;
  
  const turretName = turret.type === 'basic' ? 'Basic Turret' : 'Tank Turret';
  const borderColor = turret.type === 'basic' ? 'border-purple-500/50' : 'border-red-500/50';
  const titleColor = turret.type === 'basic' ? 'text-purple-400' : 'text-red-400';
  
  return (
    <div className={`absolute bottom-4 right-4 bg-slate-900/95 backdrop-blur rounded-xl p-4 border ${borderColor} w-80`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className={`text-xl font-bold ${titleColor} flex items-center gap-2`}>
          <Target className="h-5 w-5" />
          {turretName}
        </h3>
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="text-purple-300 hover:text-white h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-3">
        <div className="bg-slate-800/50 rounded-lg p-3 border border-purple-400/30">
          <div className="flex justify-between items-center mb-3">
            <div className="text-white font-bold text-lg">
              Level {turret.level}
              {isMaxLevel && <span className="text-yellow-400 text-sm ml-2">MAX</span>}
            </div>
            {turret.level >= 5 && (
              <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-xs text-yellow-400">Special</span>
              </div>
            )}
          </div>
          
          <div className="text-sm text-purple-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-purple-400">Damage:</span>
              <span className="font-bold">{currentStats.damage}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-400">Range:</span>
              <span className="font-bold">{currentStats.range}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-400">Fire Rate:</span>
              <span className="font-bold">{(1000 / currentStats.fireRate).toFixed(1)}/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-400">Bullet Speed:</span>
              <span className="font-bold">{currentStats.bulletSpeed}</span>
            </div>
          </div>
        </div>
        
        {!isMaxLevel && nextStats && (
          <>
            <div className="text-center">
              <ArrowUp className="h-6 w-6 text-cyan-400 mx-auto" />
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-3 border border-cyan-400/30">
              <div className="flex justify-between items-center mb-2">
                <div className="text-cyan-400 font-bold">Next Level {turret.level + 1}</div>
                <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded">
                  <Gem className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-400 font-bold">{turret.upgradeCost}</span>
                </div>
              </div>
              
              <div className="text-sm text-cyan-200 space-y-1">
                <div className="flex justify-between">
                  <span>Damage:</span>
                  <span className="text-green-400 font-bold">
                    {currentStats.damage} → {nextStats.damage} (+{nextStats.damage - currentStats.damage})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Range:</span>
                  <span className="text-green-400 font-bold">
                    {currentStats.range} → {nextStats.range}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Fire Rate:</span>
                  <span className="text-green-400 font-bold">
                    {(1000 / currentStats.fireRate).toFixed(1)} → {(1000 / nextStats.fireRate).toFixed(1)}/s
                  </span>
                </div>
              </div>
              
              {turret.level + 1 >= 5 && (
                <div className="mt-2 bg-yellow-500/10 border border-yellow-400/30 rounded p-2 text-xs text-yellow-300 flex items-start gap-2">
                  <Zap className="h-4 w-4 flex-shrink-0" />
                  <span>
                    {turret.level + 1 === 5 
                      ? "Unlocks: Enhanced splash damage!" 
                      : "Unlocks: Maximum firepower and range!"}
                  </span>
                </div>
              )}
            </div>
            
            <Button
              onClick={onUpgrade}
              disabled={!canUpgrade}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:text-slate-500"
              size="lg"
            >
              {canUpgrade ? (
                <>
                  <ArrowUp className="h-5 w-5 mr-2" />
                  Upgrade Turret
                </>
              ) : (
                'Not Enough Gems'
              )}
            </Button>
          </>
        )}
        
        {isMaxLevel && (
          <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-3 text-center">
            <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-yellow-400 font-bold">Maximum Level Reached!</div>
            <div className="text-xs text-yellow-300 mt-1">This turret is fully evolved</div>
          </div>
        )}
        
        <Button
          onClick={onDelete}
          variant="ghost"
          className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 border border-red-500/50"
          size="lg"
        >
          <Trash2 className="h-5 w-5 mr-2" />
          Delete Turret (50% Refund)
        </Button>
      </div>
    </div>
  );
}
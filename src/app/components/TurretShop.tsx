import { Gem, Target, Info } from 'lucide-react';
import { Button } from './ui/button';
import { TURRET_STATS, TANK_TURRET_STATS, TurretType } from '../types/game';

interface TurretShopProps {
  gems: number;
  onBuyTurret: (type: TurretType) => void;
}

export function TurretShop({ gems, onBuyTurret }: TurretShopProps) {
  const basicCost = TURRET_STATS[0].cost;
  const tankCost = TANK_TURRET_STATS[0].cost;
  const canBuyBasic = gems >= basicCost;
  const canBuyTank = gems >= tankCost;
  
  return (
    <div className="absolute bottom-4 left-4 bg-slate-900/95 backdrop-blur rounded-lg p-2 border border-cyan-500/50 w-48">
      <h3 className="text-sm font-bold text-cyan-400 mb-1.5 flex items-center gap-1.5">
        <Target className="h-3 w-3" />
        Turret Shop
      </h3>
      
      <div className="space-y-1.5">
        <div className="bg-slate-800/50 rounded p-1.5 border border-cyan-400/30">
          <div className="flex justify-between items-center mb-1">
            <div>
              <div className="text-white font-bold text-xs">Basic</div>
              <div className="text-[10px] text-cyan-300">DMG: {TURRET_STATS[0].damage}</div>
            </div>
            <div className="flex items-center gap-0.5 bg-yellow-500/20 px-1 py-0.5 rounded">
              <Gem className="h-2.5 w-2.5 text-yellow-400" />
              <span className="text-yellow-400 font-bold text-xs">{basicCost}</span>
            </div>
          </div>
          
          <Button
            onClick={() => onBuyTurret('basic')}
            disabled={!canBuyBasic}
            className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 disabled:text-slate-500 text-xs h-6 px-2"
          >
            {canBuyBasic ? 'Place' : 'Need Gems'}
          </Button>
        </div>
        
        <div className="bg-slate-800/50 rounded p-1.5 border border-red-400/30">
          <div className="flex justify-between items-center mb-1">
            <div>
              <div className="text-white font-bold text-xs">Tank</div>
              <div className="text-[10px] text-red-300">DMG: {TANK_TURRET_STATS[0].damage}</div>
            </div>
            <div className="flex items-center gap-0.5 bg-yellow-500/20 px-1 py-0.5 rounded">
              <Gem className="h-2.5 w-2.5 text-yellow-400" />
              <span className="text-yellow-400 font-bold text-xs">{tankCost}</span>
            </div>
          </div>
          
          <Button
            onClick={() => onBuyTurret('tank')}
            disabled={!canBuyTank}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-700 disabled:text-slate-500 text-xs h-6 px-2"
          >
            {canBuyTank ? 'Place' : 'Need Gems'}
          </Button>
        </div>
      </div>
    </div>
  );
}
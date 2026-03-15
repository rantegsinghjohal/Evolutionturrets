import { useState, useEffect, useCallback, useRef } from 'react';
import { GameCanvas } from './GameCanvas';
import { GameUI } from './GameUI';
import { TurretShop } from './TurretShop';
import { TurretUpgrade } from './TurretUpgrade';
import { GameOver } from './GameOver';
import {
  GameState,
  Enemy,
  Turret,
  Bullet,
  TURRET_STATS,
  TANK_TURRET_STATS,
  ENEMY_STATS,
  EnemyType,
  TurretType,
} from '../types/game';
import { getPositionOnPath, getDistance, isPositionOnPath } from '../utils/pathUtils';
import {
  playShootSound,
  playEnemyDefeatedSound,
  playUpgradeSound,
  playWaveStartSound,
  playGameOverSound,
} from '../utils/soundUtils';

interface GameProps {
  onMainMenu: () => void;
}

export function Game({ onMainMenu }: GameProps) {
  const [gameState, setGameState] = useState<GameState>({
    screen: 'game',
    gems: 3000,
    wave: 1,
    baseHealth: 120,
    maxBaseHealth: 120,
    turrets: [],
    enemies: [],
    bullets: [],
    selectedTurret: null,
    isPaused: false,
    isWaveActive: false,
    enemiesKilled: 0,
    score: 0,
  });
  
  const [placingTurret, setPlacingTurret] = useState(false);
  const [placingTurretType, setPlacingTurretType] = useState<TurretType | null>(null);
  const gameLoopRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const waveSpawnRef = useRef<{ count: number; timer: number }>({ count: 0, timer: 0 });
  
  // Game loop
  useEffect(() => {
    const gameLoop = (currentTime: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = currentTime;
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;
      
      if (!gameState.isPaused && gameState.screen === 'game') {
        updateGame(deltaTime);
      }
      
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState]);
  
  const updateGame = (deltaTime: number) => {
    setGameState(prev => {
      let newState = { ...prev };
      
      // Spawn enemies for active wave
      if (newState.isWaveActive) {
        const enemiesToSpawn = getWaveEnemies(newState.wave);
        
        if (waveSpawnRef.current.count < enemiesToSpawn.length) {
          waveSpawnRef.current.timer += deltaTime;
          
          if (waveSpawnRef.current.timer >= 1500) {
            const enemyType = enemiesToSpawn[waveSpawnRef.current.count];
            newState.enemies = [...newState.enemies, createEnemy(enemyType)];
            waveSpawnRef.current.count++;
            waveSpawnRef.current.timer = 0;
          }
        } else if (newState.enemies.length === 0) {
          // Wave complete
          newState.isWaveActive = false;
          waveSpawnRef.current = { count: 0, timer: 0 };
        }
      }
      
      // Update enemy positions
      newState.enemies = newState.enemies.map(enemy => {
        const newProgress = enemy.pathProgress + (enemy.speed * deltaTime) / 1000;
        
        if (newProgress >= 1) {
          // Enemy reached base
          newState.baseHealth = Math.max(0, newState.baseHealth - 10);
          return null;
        }
        
        return {
          ...enemy,
          pathProgress: newProgress,
          position: getPositionOnPath(newProgress),
        };
      }).filter((e): e is Enemy => e !== null);
      
      // Check for game over
      if (newState.baseHealth <= 0 && newState.screen === 'game') {
        newState.screen = 'gameOver';
        newState.score = newState.wave * 100 + newState.enemiesKilled * 10;
        playGameOverSound();
      }
      
      // Turrets shoot at enemies
      const currentTime = Date.now();
      newState.turrets.forEach(turret => {
        if (currentTime - turret.lastFired >= turret.fireRate) {
          // Find nearest enemy in range
          const target = newState.enemies.find(enemy => {
            const distance = getDistance(turret.position, enemy.position);
            return distance <= turret.range;
          });
          
          if (target) {
            newState.bullets.push(createBullet(turret, target.id));
            turret.lastFired = currentTime;
            playShootSound();
          }
        }
      });
      
      // Update bullets
      newState.bullets = newState.bullets.map(bullet => {
        const targetEnemy = newState.enemies.find(e => e.id === bullet.targetEnemy);
        
        if (!targetEnemy) return null;
        
        const dx = targetEnemy.position.x - bullet.position.x;
        const dy = targetEnemy.position.y - bullet.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 10) {
          // Hit enemy
          const enemy = newState.enemies.find(e => e.id === bullet.targetEnemy);
          if (enemy) {
            enemy.health -= bullet.damage;
            
            // Splash damage for level 5+ turrets
            if (bullet.turretLevel >= 5) {
              newState.enemies.forEach(e => {
                if (e.id !== enemy.id) {
                  const splashDistance = getDistance(e.position, enemy.position);
                  if (splashDistance < 50) {
                    e.health -= bullet.damage * 0.3;
                  }
                }
              });
            }
            
            if (enemy.health <= 0) {
              newState.gems += enemy.gemReward;
              newState.enemiesKilled++;
              newState.enemies = newState.enemies.filter(e => e.id !== enemy.id);
              playEnemyDefeatedSound();
            }
          }
          return null;
        }
        
        const angle = Math.atan2(dy, dx);
        return {
          ...bullet,
          position: {
            x: bullet.position.x + Math.cos(angle) * bullet.speed,
            y: bullet.position.y + Math.sin(angle) * bullet.speed,
          },
        };
      }).filter((b): b is Bullet => b !== null);
      
      return newState;
    });
  };
  
  const getWaveEnemies = (wave: number): EnemyType[] => {
    const enemies: EnemyType[] = [];
    
    // Boss every 11 waves
    if (wave % 11 === 0) {
      enemies.push('boss');
    }
    
    // Base enemies - start with just 3 in wave 1
    const baseCount = wave === 1 ? 3 : Math.min(3 + wave, 20);
    for (let i = 0; i < baseCount; i++) {
      enemies.push('basic');
    }
    
    // Add fast enemies after wave 5 (delayed)
    if (wave >= 5) {
      const fastCount = Math.min(Math.floor((wave - 4) / 2), 8);
      for (let i = 0; i < fastCount; i++) {
        enemies.push('fast');
      }
    }
    
    // Add tank enemies starting from wave 4
    if (wave >= 4) {
      const tankCount = Math.min(Math.floor((wave - 3) / 2) + 1, 5);
      for (let i = 0; i < tankCount; i++) {
        enemies.push('tank');
      }
    }
    
    // Shuffle enemies
    return enemies.sort(() => Math.random() - 0.5);
  };
  
  const createEnemy = (type: EnemyType): Enemy => {
    const stats = ENEMY_STATS[type];
    const healthMultiplier = 1 + (gameState.wave - 1) * 0.2;
    
    // Boss-specific scaling - each boss wave makes bosses stronger
    let bossMultiplier = 1;
    if (type === 'boss') {
      const bossNumber = Math.floor(gameState.wave / 11); // 1st boss, 2nd boss, 3rd boss, etc.
      bossMultiplier = 1 + (bossNumber - 1) * 0.5; // Each boss is 50% stronger than the previous
      bossMultiplier *= 3; // Bosses have 3x health
    }
    
    // Reduce speed for basic enemies in early waves
    let speedMultiplier = 1;
    if (type === 'basic' && gameState.wave <= 3) {
      speedMultiplier = 0.5; // 50% slower in first 3 waves
    }
    
    // Slow down boss speed by 2
    if (type === 'boss') {
      speedMultiplier = 0.5; // Bosses move at half speed
    }
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      type,
      health: stats.health * healthMultiplier * bossMultiplier,
      maxHealth: stats.health * healthMultiplier * bossMultiplier,
      position: getPositionOnPath(0),
      speed: stats.speed * speedMultiplier,
      gemReward: stats.gemReward * (type === 'boss' ? bossMultiplier : 1),
      pathProgress: 0,
    };
  };
  
  const createBullet = (turret: Turret, targetEnemyId: string): Bullet => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      position: { ...turret.position },
      targetEnemy: targetEnemyId,
      damage: turret.damage,
      speed: turret.bulletSpeed,
      turretLevel: turret.level,
    };
  };
  
  const handleStartWave = () => {
    setGameState(prev => {
      // Only increment wave if the previous wave is complete
      const shouldIncrementWave = prev.enemies.length === 0 && !prev.isWaveActive;
      
      return {
        ...prev,
        isWaveActive: true,
        wave: shouldIncrementWave ? prev.wave + 1 : prev.wave,
      };
    });
    waveSpawnRef.current = { count: 0, timer: 0 };
    playWaveStartSound();
  };
  
  const handlePause = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };
  
  const handleBuyTurret = (type: TurretType) => {
    const stats = type === 'basic' ? TURRET_STATS[0] : TANK_TURRET_STATS[0];
    if (gameState.gems >= stats.cost) {
      setPlacingTurret(true);
      setPlacingTurretType(type);
    }
  };
  
  const handleCanvasClick = (x: number, y: number) => {
    if (placingTurret && placingTurretType) {
      // Check if position is valid (not on path)
      if (!isPositionOnPath({ x, y }, 50)) {
        const stats = placingTurretType === 'basic' ? TURRET_STATS[0] : TANK_TURRET_STATS[0];
        
        const newTurret: Turret = {
          id: Math.random().toString(36).substr(2, 9),
          type: placingTurretType,
          position: { x, y },
          level: 1,
          damage: stats.damage,
          range: stats.range,
          fireRate: stats.fireRate,
          lastFired: 0,
          bulletSpeed: stats.bulletSpeed,
          cost: stats.cost,
          upgradeCost: stats.upgradeCost,
        };
        
        setGameState(prev => ({
          ...prev,
          turrets: [...prev.turrets, newTurret],
          gems: prev.gems - stats.cost,
        }));
        setPlacingTurret(false);
        setPlacingTurretType(null);
      }
    } else {
      // Deselect turret if clicking empty space
      setGameState(prev => ({ ...prev, selectedTurret: null }));
    }
  };
  
  const handleTurretClick = (turretId: string) => {
    setGameState(prev => ({ ...prev, selectedTurret: turretId }));
    setPlacingTurret(false);
  };
  
  const handleUpgrade = () => {
    if (!gameState.selectedTurret) return;
    
    setGameState(prev => {
      const turret = prev.turrets.find(t => t.id === prev.selectedTurret);
      if (!turret || turret.level >= 10 || prev.gems < turret.upgradeCost) return prev;
      
      const newLevel = turret.level + 1;
      const statsArray = turret.type === 'basic' ? TURRET_STATS : TANK_TURRET_STATS;
      const newStats = statsArray[newLevel - 1];
      
      const updatedTurrets = prev.turrets.map(t =>
        t.id === turret.id
          ? {
              ...t,
              level: newLevel,
              damage: newStats.damage,
              range: newStats.range,
              fireRate: newStats.fireRate,
              bulletSpeed: newStats.bulletSpeed,
              upgradeCost: newStats.upgradeCost,
            }
          : t
      );
      
      playUpgradeSound();
      
      return {
        ...prev,
        turrets: updatedTurrets,
        gems: prev.gems - turret.upgradeCost,
      };
    });
  };
  
  const handleDeleteTurret = () => {
    if (!gameState.selectedTurret) return;
    
    setGameState(prev => {
      const turret = prev.turrets.find(t => t.id === prev.selectedTurret);
      if (!turret) return prev;
      
      // Calculate refund (50% of initial cost + 50% of all upgrade costs)
      const statsArray = turret.type === 'basic' ? TURRET_STATS : TANK_TURRET_STATS;
      let totalInvested = statsArray[0].cost;
      for (let i = 1; i < turret.level; i++) {
        totalInvested += statsArray[i - 1].upgradeCost;
      }
      const refund = Math.floor(totalInvested * 0.5);
      
      return {
        ...prev,
        turrets: prev.turrets.filter(t => t.id !== turret.id),
        gems: prev.gems + refund,
        selectedTurret: null,
      };
    });
  };
  
  const handleRestart = () => {
    setGameState({
      screen: 'game',
      gems: 3000,
      wave: 1,
      baseHealth: 120,
      maxBaseHealth: 120,
      turrets: [],
      enemies: [],
      bullets: [],
      selectedTurret: null,
      isPaused: false,
      isWaveActive: false,
      enemiesKilled: 0,
      score: 0,
    });
    setPlacingTurret(false);
    setPlacingTurretType(null);
    waveSpawnRef.current = { count: 0, timer: 0 };
  };
  
  const selectedTurretData = gameState.selectedTurret
    ? gameState.turrets.find(t => t.id === gameState.selectedTurret)
    : null;
  
  return (
    <div className="relative min-h-screen bg-slate-950">
      <GameUI
        gems={gameState.gems}
        wave={gameState.wave}
        baseHealth={gameState.baseHealth}
        maxBaseHealth={gameState.maxBaseHealth}
        isPaused={gameState.isPaused}
        isWaveActive={gameState.isWaveActive}
        onPause={handlePause}
        onStartWave={handleStartWave}
      />
      
      <GameCanvas
        enemies={gameState.enemies}
        turrets={gameState.turrets}
        bullets={gameState.bullets}
        selectedTurret={gameState.selectedTurret}
        onCanvasClick={handleCanvasClick}
        onTurretClick={handleTurretClick}
        placingTurret={placingTurret}
      />
      
      {!selectedTurretData && (
        <TurretShop gems={gameState.gems} onBuyTurret={handleBuyTurret} />
      )}
      
      {selectedTurretData && (
        <TurretUpgrade
          turret={selectedTurretData}
          gems={gameState.gems}
          onUpgrade={handleUpgrade}
          onDelete={handleDeleteTurret}
          onClose={() => setGameState(prev => ({ ...prev, selectedTurret: null }))}
        />
      )}
      
      {gameState.screen === 'gameOver' && (
        <GameOver
          wave={gameState.wave}
          enemiesKilled={gameState.enemiesKilled}
          score={gameState.score}
          onRestart={handleRestart}
          onMainMenu={onMainMenu}
        />
      )}
      
      {placingTurret && (
        <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 bg-cyan-500/90 text-white px-6 py-3 rounded-full font-bold shadow-lg animate-pulse">
          Click on the map to place turret (avoid the path!)
        </div>
      )}
    </div>
  );
}
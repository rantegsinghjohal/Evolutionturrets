// Game Types and Interfaces

export type EnemyType = 'basic' | 'fast' | 'tank' | 'boss';
export type TurretType = 'basic' | 'tank';
export type GameScreen = 'menu' | 'game' | 'howToPlay' | 'gameOver';

export interface Position {
  x: number;
  y: number;
}

export interface Enemy {
  id: string;
  type: EnemyType;
  health: number;
  maxHealth: number;
  position: Position;
  speed: number;
  gemReward: number;
  pathProgress: number;
}

export interface Turret {
  id: string;
  type: TurretType;
  position: Position;
  level: number;
  damage: number;
  range: number;
  fireRate: number;
  lastFired: number;
  bulletSpeed: number;
  cost: number;
  upgradeCost: number;
}

export interface Bullet {
  id: string;
  position: Position;
  targetEnemy: string;
  damage: number;
  speed: number;
  turretLevel: number;
}

export interface GameState {
  screen: GameScreen;
  gems: number;
  wave: number;
  baseHealth: number;
  maxBaseHealth: number;
  turrets: Turret[];
  enemies: Enemy[];
  bullets: Bullet[];
  selectedTurret: string | null;
  isPaused: boolean;
  isWaveActive: boolean;
  enemiesKilled: number;
  score: number;
}

export const TURRET_STATS = [
  { level: 1, damage: 10, range: 120, fireRate: 500, bulletSpeed: 100, cost: 20, upgradeCost: 75 },
  { level: 2, damage: 20, range: 130, fireRate: 450, bulletSpeed: 100, cost: 0, upgradeCost: 150 },
  { level: 3, damage: 35, range: 140, fireRate: 400, bulletSpeed: 100, cost: 0, upgradeCost: 250 },
  { level: 4, damage: 55, range: 150, fireRate: 350, bulletSpeed: 100, cost: 0, upgradeCost: 400 },
  { level: 5, damage: 80, range: 170, fireRate: 300, bulletSpeed: 100, cost: 0, upgradeCost: 600 },
  { level: 6, damage: 120, range: 200, fireRate: 250, bulletSpeed: 100, cost: 0, upgradeCost: 850 },
  { level: 7, damage: 170, range: 220, fireRate: 200, bulletSpeed: 100, cost: 0, upgradeCost: 1200 },
  { level: 8, damage: 240, range: 240, fireRate: 175, bulletSpeed: 100, cost: 0, upgradeCost: 1600 },
  { level: 9, damage: 340, range: 260, fireRate: 150, bulletSpeed: 100, cost: 0, upgradeCost: 2200 },
  { level: 10, damage: 500, range: 300, fireRate: 125, bulletSpeed: 100, cost: 0, upgradeCost: 0 },
];

export const TANK_TURRET_STATS = [
  { level: 1, damage: 25, range: 150, fireRate: 1000, bulletSpeed: 80, cost: 50, upgradeCost: 150 },
  { level: 2, damage: 45, range: 160, fireRate: 900, bulletSpeed: 80, cost: 0, upgradeCost: 300 },
  { level: 3, damage: 75, range: 170, fireRate: 800, bulletSpeed: 80, cost: 0, upgradeCost: 500 },
  { level: 4, damage: 120, range: 180, fireRate: 700, bulletSpeed: 80, cost: 0, upgradeCost: 800 },
  { level: 5, damage: 180, range: 200, fireRate: 600, bulletSpeed: 80, cost: 0, upgradeCost: 1200 },
  { level: 6, damage: 270, range: 230, fireRate: 550, bulletSpeed: 80, cost: 0, upgradeCost: 1700 },
  { level: 7, damage: 380, range: 250, fireRate: 500, bulletSpeed: 80, cost: 0, upgradeCost: 2400 },
  { level: 8, damage: 530, range: 270, fireRate: 450, bulletSpeed: 80, cost: 0, upgradeCost: 3200 },
  { level: 9, damage: 750, range: 290, fireRate: 400, bulletSpeed: 80, cost: 0, upgradeCost: 4400 },
  { level: 10, damage: 1100, range: 320, fireRate: 350, bulletSpeed: 80, cost: 0, upgradeCost: 0 },
];

export const ENEMY_STATS = {
  basic: { health: 30, speed: 0.6, gemReward: 20, color: '#4ade80' },
  fast: { health: 20, speed: 0.4, gemReward: 40, color: '#fbbf24' },
  tank: { health: 80, speed: 0.3, gemReward: 50, color: '#ef4444' },
  boss: { health: 300, speed: 0.4, gemReward: 100, color: '#a855f7' },
};

export const GRID_SIZE = 60;
export const GAME_WIDTH = 900;
export const GAME_HEIGHT = 600;
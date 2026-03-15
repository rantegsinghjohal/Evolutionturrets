import { useEffect, useRef, useState } from 'react';
import { Enemy, Turret, Bullet, ENEMY_STATS, TURRET_STATS } from '../types/game';
import { PATH_WAYPOINTS, getPositionOnPath } from '../utils/pathUtils';

interface GameCanvasProps {
  enemies: Enemy[];
  turrets: Turret[];
  bullets: Bullet[];
  selectedTurret: string | null;
  onCanvasClick: (x: number, y: number) => void;
  onTurretClick: (turretId: string) => void;
  placingTurret?: boolean;
}

export function GameCanvas({
  enemies,
  turrets,
  bullets,
  selectedTurret,
  onCanvasClick,
  onTurretClick,
  placingTurret = false,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Draw path
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 80;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(PATH_WAYPOINTS[0].x, PATH_WAYPOINTS[0].y);
    for (let i = 1; i < PATH_WAYPOINTS.length; i++) {
      ctx.lineTo(PATH_WAYPOINTS[i].x, PATH_WAYPOINTS[i].y);
    }
    ctx.stroke();
    
    // Draw path center line (for visual clarity)
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(PATH_WAYPOINTS[0].x, PATH_WAYPOINTS[0].y);
    for (let i = 1; i < PATH_WAYPOINTS.length; i++) {
      ctx.lineTo(PATH_WAYPOINTS[i].x, PATH_WAYPOINTS[i].y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw base
    const basePos = PATH_WAYPOINTS[PATH_WAYPOINTS.length - 1];
    ctx.fillStyle = '#dc2626';
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(basePos.x, basePos.y, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Draw base icon
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏰', basePos.x, basePos.y);
    
    // Draw turret preview when placing
    if (placingTurret && mousePos) {
      ctx.fillStyle = 'rgba(34, 211, 238, 0.2)';
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(mousePos.x, mousePos.y, TURRET_STATS[0].range, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = 'rgba(34, 211, 238, 0.5)';
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(mousePos.x, mousePos.y, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    
    // Draw turret ranges for selected turret
    if (selectedTurret) {
      const turret = turrets.find(t => t.id === selectedTurret);
      if (turret) {
        ctx.fillStyle = 'rgba(34, 211, 238, 0.1)';
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(turret.position.x, turret.position.y, turret.range, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }
    
    // Draw turrets
    turrets.forEach(turret => {
      const isSelected = turret.id === selectedTurret;
      
      // Different colors for tank turrets
      const baseColor = turret.type === 'tank' 
        ? (isSelected ? '#dc2626' : '#7f1d1d')
        : (isSelected ? '#06b6d4' : '#334155');
      const strokeColor = turret.type === 'tank'
        ? (isSelected ? '#b91c1c' : '#450a0a')
        : (isSelected ? '#0891b2' : '#1e293b');
      
      const x = turret.position.x;
      const y = turret.position.y;
      
      // Turret base (larger as it levels up)
      const baseSize = 20 + (turret.level * 0.5);
      ctx.fillStyle = baseColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, baseSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Level 3+: Add outer ring
      if (turret.level >= 3) {
        ctx.strokeStyle = turret.type === 'tank' ? '#ef4444' : '#06b6d4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, baseSize + 3, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Level 5+: Add rotating spikes
      if (turret.level >= 5) {
        const spikeCount = Math.min(turret.level - 2, 8);
        const spikeLength = 8;
        ctx.fillStyle = turret.type === 'tank' ? '#dc2626' : '#22d3ee';
        for (let i = 0; i < spikeCount; i++) {
          const angle = (Math.PI * 2 * i) / spikeCount;
          ctx.beginPath();
          ctx.moveTo(
            x + Math.cos(angle) * baseSize,
            y + Math.sin(angle) * baseSize
          );
          ctx.lineTo(
            x + Math.cos(angle) * (baseSize + spikeLength),
            y + Math.sin(angle) * (baseSize + spikeLength)
          );
          ctx.lineTo(
            x + Math.cos(angle + Math.PI / spikeCount) * baseSize,
            y + Math.sin(angle + Math.PI / spikeCount) * baseSize
          );
          ctx.closePath();
          ctx.fill();
        }
      }
      
      // Level 7+: Add inner decorative circles
      if (turret.level >= 7) {
        const dotCount = 4;
        const dotRadius = 15;
        ctx.fillStyle = turret.type === 'tank' ? '#fca5a5' : '#67e8f9';
        for (let i = 0; i < dotCount; i++) {
          const angle = (Math.PI * 2 * i) / dotCount;
          ctx.beginPath();
          ctx.arc(
            x + Math.cos(angle) * dotRadius,
            y + Math.sin(angle) * dotRadius,
            3,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }
      
      // Level 9+: Add energy glow effect
      if (turret.level >= 9) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = turret.type === 'tank' ? '#ef4444' : '#06b6d4';
        ctx.strokeStyle = turret.type === 'tank' ? '#f87171' : '#22d3ee';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, baseSize + 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      
      // Turret center level indicator
      const levelColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#eab308', '#ef4444', '#f97316', '#84cc16', '#22d3ee'];
      ctx.fillStyle = levelColors[Math.min(turret.level - 1, levelColors.length - 1)];
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Level number
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(turret.level.toString(), x, y);
      
      // Level 10: Crown for max level
      if (turret.level >= 10) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = '20px Arial';
        ctx.fillText('👑', x, y - 35);
      }
      // Level 5+: Special indicator
      else if (turret.level >= 5) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = '16px Arial';
        ctx.fillText('⚡', x, y - 30);
      }
    });
    
    // Draw bullets
    bullets.forEach(bullet => {
      const levelColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#eab308'];
      ctx.fillStyle = levelColors[bullet.turretLevel - 1] || '#3b82f6';
      ctx.shadowBlur = 10;
      ctx.shadowColor = ctx.fillStyle;
      ctx.beginPath();
      ctx.arc(bullet.position.x, bullet.position.y, bullet.turretLevel >= 5 ? 5 : 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    
    // Draw enemies
    enemies.forEach(enemy => {
      const stats = ENEMY_STATS[enemy.type];
      const pos = getPositionOnPath(enemy.pathProgress);
      
      // Enemy body
      const enemySize = enemy.type === 'tank' ? 18 : enemy.type === 'boss' ? 24 : 14;
      ctx.fillStyle = stats.color;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, enemySize, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Boss crown
      if (enemy.type === 'boss') {
        ctx.fillStyle = '#fbbf24';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('👑', pos.x, pos.y - 30);
      }
      
      // Health bar
      const healthBarWidth = 40;
      const healthBarHeight = 6;
      const healthPercentage = enemy.health / enemy.maxHealth;
      
      // Health bar background (border)
      ctx.fillStyle = '#000000';
      ctx.fillRect(pos.x - healthBarWidth / 2 - 1, pos.y - enemySize - 12, healthBarWidth + 2, healthBarHeight + 2);
      
      // Health bar background
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(pos.x - healthBarWidth / 2, pos.y - enemySize - 11, healthBarWidth, healthBarHeight);
      
      // Health bar fill
      ctx.fillStyle = healthPercentage > 0.5 ? '#10b981' : healthPercentage > 0.25 ? '#fbbf24' : '#ef4444';
      ctx.fillRect(pos.x - healthBarWidth / 2, pos.y - enemySize - 11, healthBarWidth * healthPercentage, healthBarHeight);
    });
    
  }, [enemies, turrets, bullets, selectedTurret, placingTurret, mousePos]);
  
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if clicking on a turret
    const clickedTurret = turrets.find(turret => {
      const dx = turret.position.x - x;
      const dy = turret.position.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= 20;
    });
    
    if (clickedTurret) {
      onTurretClick(clickedTurret.id);
    } else {
      onCanvasClick(x, y);
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePos({ x, y });
  };
  
  return (
    <div className="flex items-center justify-center bg-slate-950 p-4">
      <canvas
        ref={canvasRef}
        width={900}
        height={600}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        className="border-4 border-purple-500/50 rounded-lg cursor-crosshair shadow-2xl"
      />
    </div>
  );
}
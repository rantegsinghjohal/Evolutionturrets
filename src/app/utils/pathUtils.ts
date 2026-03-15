import { Position } from '../types/game';

// Define the enemy path (waypoints)
export const PATH_WAYPOINTS: Position[] = [
  { x: 0, y: 300 },
  { x: 200, y: 300 },
  { x: 200, y: 150 },
  { x: 450, y: 150 },
  { x: 450, y: 450 },
  { x: 700, y: 450 },
  { x: 700, y: 300 },
  { x: 900, y: 300 },
];

export function getPositionOnPath(progress: number): Position {
  // Calculate total path length
  let totalLength = 0;
  const segmentLengths: number[] = [];
  
  for (let i = 0; i < PATH_WAYPOINTS.length - 1; i++) {
    const dx = PATH_WAYPOINTS[i + 1].x - PATH_WAYPOINTS[i].x;
    const dy = PATH_WAYPOINTS[i + 1].y - PATH_WAYPOINTS[i].y;
    const length = Math.sqrt(dx * dx + dy * dy);
    segmentLengths.push(length);
    totalLength += length;
  }
  
  // Find position along path
  const targetDistance = progress * totalLength;
  let currentDistance = 0;
  
  for (let i = 0; i < segmentLengths.length; i++) {
    if (currentDistance + segmentLengths[i] >= targetDistance) {
      const segmentProgress = (targetDistance - currentDistance) / segmentLengths[i];
      const startPoint = PATH_WAYPOINTS[i];
      const endPoint = PATH_WAYPOINTS[i + 1];
      
      return {
        x: startPoint.x + (endPoint.x - startPoint.x) * segmentProgress,
        y: startPoint.y + (endPoint.y - startPoint.y) * segmentProgress,
      };
    }
    currentDistance += segmentLengths[i];
  }
  
  return PATH_WAYPOINTS[PATH_WAYPOINTS.length - 1];
}

export function getDistance(pos1: Position, pos2: Position): number {
  const dx = pos2.x - pos1.x;
  const dy = pos2.y - pos1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function isPositionOnPath(pos: Position, buffer: number = 40): boolean {
  for (let i = 0; i < PATH_WAYPOINTS.length - 1; i++) {
    const start = PATH_WAYPOINTS[i];
    const end = PATH_WAYPOINTS[i + 1];
    
    // Calculate distance from point to line segment
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lengthSquared = dx * dx + dy * dy;
    
    if (lengthSquared === 0) continue;
    
    const t = Math.max(0, Math.min(1, ((pos.x - start.x) * dx + (pos.y - start.y) * dy) / lengthSquared));
    const projectionX = start.x + t * dx;
    const projectionY = start.y + t * dy;
    
    const distance = getDistance(pos, { x: projectionX, y: projectionY });
    
    if (distance < buffer) return true;
  }
  
  return false;
}

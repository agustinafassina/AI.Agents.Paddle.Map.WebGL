export const AGENT_COLLISION_RADIUS = 0.25;

export const SCENE_WALK_BOUNDS = {
  minX: -4.6,
  maxX: 4.6,
  minZ: -6.2,
  maxZ: 7.2,
} as const;

export type CircleObstacle = {
  kind: 'circle';
  x: number;
  z: number;
  radius: number;
};

export type BoxObstacle = {
  kind: 'box';
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
};

export type PaddleObstacle = CircleObstacle | BoxObstacle;

export const PADDLE_OBSTACLES: PaddleObstacle[] = [];

export function clampToWalkBounds(x: number, z: number): [number, number] {
  const pad = AGENT_COLLISION_RADIUS;
  return [
    Math.max(SCENE_WALK_BOUNDS.minX + pad, Math.min(SCENE_WALK_BOUNDS.maxX - pad, x)),
    Math.max(SCENE_WALK_BOUNDS.minZ + pad, Math.min(SCENE_WALK_BOUNDS.maxZ - pad, z)),
  ];
}

export function isFurnitureOccupiedPosition(): boolean {
  return false;
}

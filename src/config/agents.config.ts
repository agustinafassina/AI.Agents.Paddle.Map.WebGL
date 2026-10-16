import { getZoneWaypoints } from '@/config/agentZones.config';
import type { PaddleZoneId } from '@/config/paddleZones';
import type { AgentDefinition } from '@/types/agent';

export const AVATAR_ILLUSTRATED_PALETTE: {
  avatarColor: string;
  accentColor: string;
  logoUrl: string;
}[] = [
  { avatarColor: '#9aab9e', accentColor: '#5a7358', logoUrl: '/logos/cursor.svg' },
  { avatarColor: '#c4a882', accentColor: '#8f7354', logoUrl: '/logos/research.svg' },
  { avatarColor: '#e2725b', accentColor: '#c86a48', logoUrl: '/logos/design.svg' },
  { avatarColor: '#87a685', accentColor: '#4a6b52', logoUrl: '/logos/ops.svg' },
  { avatarColor: '#d4a574', accentColor: '#a67b5b', logoUrl: '/logos/review.svg' },
  { avatarColor: '#bea078', accentColor: '#6b5340', logoUrl: '/logos/data.svg' },
];

export const PADDLE_PALETTE = {
  /** Night court backdrop. */
  sceneBackground: '#101820',
  outline: '#5c4f45',
  /** Limestone / sand floor tiles (keys kept for texture map slots). */
  tileSage: '#e6dccf',
  tileGray: '#d4c8b8',
  tileGrout: '#c2b4a2',
  floorPlatform: '#b5a48e',
  wall: '#faf6f0',
  wallMarble: '#f0e8dc',
  wallStripe: '#e4d8c8',
  wallAccent: '#ebe2d4',
  wood: '#c9a87a',
  woodLight: '#edd9b8',
  woodDark: '#7a5c3e',
  woodTable: '#5c4330',
  deskTop: '#e8d4b4',
  deskLeg: '#faf6f0',
  monitor: '#3a3836',
  monitorGlow: '#d4c4a8',
  /** Soft olive accent — use sparingly; plants carry the green. */
  sage: '#9aab8e',
  sageDark: '#6a7358',
  terracotta: '#c86a48',
  terracottaLight: '#e07a58',
  plant: '#5c9a6c',
  plantDark: '#3d6848',
  plantPot: '#b89068',
  potCeramic: '#f7f2ea',
  whiteboard: '#fafcfd',
  rug: '#b89878',
  rugWeave: '#a88868',
  metal: '#a8a4a0',
  espresso: '#2a2624',
  stringLight: '#ffedb8',
  underGlow: '#ffdba0',
  chairMesh: '#3a3634',
  chairTan: '#c4a078',
  chairCream: '#ebe2d4',
  chairWhite: '#f6f2ec',
  chairYellow: '#e5c76a',
  olive: '#8a7a5c',
  stoolGray: '#c8c0b8',
  chairForest: '#6b5340',
  platformWood: '#a67b5b',
  zoneMatSage: '#e8dcc8',
  matTransition: '#d8c8b4',
  mossMat: '#d0c0a8',
  foliageDeep: '#3f6b4a',
  terracottaPot: '#c47852',
  creamCeramic: '#f7f2ea',
  softBloom: '#ffe9c8',
  glass: '#c8dce4',
  mug: '#f4f0ea',
  notebook: '#faf8f4',
  selectionGlow: '#ffe9a8',
  fog: '#121a24',
} as const;

export const AGENT_DEFINITIONS: AgentDefinition[] = [
  {
    id: 'nico-agent',
    name: 'Nico',
    role: 'Drive',
    modelId: 'llama3-local',
    logoUrl: '/logos/ops.svg',
    avatarColor: '#3d7eea',
    accentColor: '#1d4ed8',
    homeZone: 'side-a',
    systemPrompt:
      'You are Nico, the right-side player on the near padel pair. Talk tactics, volleys, and how the point is going.',
  },
  {
    id: 'luna-agent',
    name: 'Luna',
    role: 'Backhand',
    modelId: 'gemma2-2b-local',
    logoUrl: '/logos/design.svg',
    avatarColor: '#5b93f5',
    accentColor: '#2563eb',
    homeZone: 'side-a',
    systemPrompt:
      'You are Luna, the backhand player on the near padel pair. Talk lobs, glass, and pairing with Nico.',
  },
  {
    id: 'mateo-agent',
    name: 'Mateo',
    role: 'Drive',
    modelId: 'qwen2.5-1.5b-local',
    logoUrl: '/logos/research.svg',
    avatarColor: '#e4c08a',
    accentColor: '#b8894a',
    homeZone: 'side-b',
    systemPrompt:
      'You are Mateo, the right-side player on the far padel pair. Talk serves, bandeja, and closing the net.',
  },
  {
    id: 'sofia-agent',
    name: 'Sofia',
    role: 'Backhand',
    modelId: 'llama3.2-1b-local',
    logoUrl: '/logos/review.svg',
    avatarColor: '#f0d2a4',
    accentColor: '#c4a574',
    homeZone: 'side-b',
    systemPrompt:
      'You are Sofia, the backhand player on the far padel pair. Talk defense, chiquitas, and how the score feels.',
  },
];

export function getAgentsByZone(zoneId: PaddleZoneId): AgentDefinition[] {
  if (zoneId === 'all') return AGENT_DEFINITIONS;
  return AGENT_DEFINITIONS.filter((agent) => agent.homeZone === zoneId);
}

export const PADDLE_WAYPOINTS = getZoneWaypoints('side-a');

export const SCENE_CONFIG = {
  bounds: { minX: -6.5, maxX: 7, minZ: -5.5, maxZ: 5 },
  walkSpeed: 1.05,
  idlePauseMin: 2,
  idlePauseMax: 5,
  coffeeBreakChance: 0.24,
  coffeeDurationMin: 4,
  coffeeDurationMax: 9,
} as const;

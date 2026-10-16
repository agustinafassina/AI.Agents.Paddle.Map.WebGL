import type { AgentHomeZone } from '@/types/agent';

export const COURT_WIDTH = 5;
export const COURT_LENGTH = 10;
export const COURT_HALF_W = COURT_WIDTH / 2;
export const COURT_HALF_L = COURT_LENGTH / 2;
export const GLASS_HEIGHT = 2.15;
export const SERVICE_Z = 2.15;

export type CourtTeam = 'a' | 'b';
export type CourtSlotId = 'near-drive' | 'near-backhand' | 'far-drive' | 'far-backhand';

export interface PlayerSlot {
  id: CourtSlotId;
  agentId: string;
  team: CourtTeam;
  homeZone: AgentHomeZone;
  position: [number, number, number];
  rotation: number;
}

/** Near team faces -Z (toward the net). Far team faces +Z. */
export const PLAYER_SLOTS: PlayerSlot[] = [
  {
    id: 'near-drive',
    agentId: 'nico-agent',
    team: 'a',
    homeZone: 'side-a',
    position: [1.15, 0, 3.55],
    rotation: Math.PI,
  },
  {
    id: 'near-backhand',
    agentId: 'luna-agent',
    team: 'a',
    homeZone: 'side-a',
    position: [-1.15, 0, 3.55],
    rotation: Math.PI,
  },
  {
    id: 'far-drive',
    agentId: 'mateo-agent',
    team: 'b',
    homeZone: 'side-b',
    position: [-1.15, 0, -3.55],
    rotation: 0,
  },
  {
    id: 'far-backhand',
    agentId: 'sofia-agent',
    team: 'b',
    homeZone: 'side-b',
    position: [1.15, 0, -3.55],
    rotation: 0,
  },
];

const SLOT_BY_AGENT = new Map(PLAYER_SLOTS.map((slot) => [slot.agentId, slot]));

export function getPlayerSlot(agentId: string): PlayerSlot {
  return SLOT_BY_AGENT.get(agentId) ?? PLAYER_SLOTS[0];
}

export function teamOfAgent(agentId: string): CourtTeam {
  return getPlayerSlot(agentId).team;
}

export function contactPoint(agentId: string): [number, number, number] {
  const slot = getPlayerSlot(agentId);
  const towardNet = slot.team === 'a' ? -0.28 : 0.28;
  return [slot.position[0], 1.05, slot.position[2] + towardNet];
}

export function winnerLanding(hitterId: string): [number, number, number] {
  const slot = getPlayerSlot(hitterId);
  return [-slot.position[0] * 0.85, 0.22, slot.team === 'a' ? -3.15 : 3.15];
}

export const POINT_LABELS = ['0', '15', '30', '40'] as const;

export function formatPointScore(points: 0 | 1 | 2 | 3): string {
  return POINT_LABELS[points];
}

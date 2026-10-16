import { getPlayerSlot, PLAYER_SLOTS } from '@/config/courtLayout';
import type { AgentDefinition, AgentHomeZone } from '@/types/agent';
import type { ChatAnchor, Waypoint } from '@/types/scene';

const ARRIVAL_RADIUS = 0.45;

const ZONE_ANCHORS: Record<AgentHomeZone, [number, number, number]> = {
  'side-a': [0, 0, 2.4],
  'side-b': [0, 0, -2.4],
  bench: [0, 0, 6.15],
};

export function getZoneWaypoints(zone: AgentHomeZone): Waypoint[] {
  const players = PLAYER_SLOTS.filter((slot) => slot.homeZone === zone);
  if (players.length === 0) {
    const [x, , z] = ZONE_ANCHORS[zone];
    return [{ id: `wp-${zone}`, zone, position: [x, 0, z] }];
  }
  return players.map((slot) => ({
    id: `wp-${slot.id}`,
    zone,
    position: [...slot.position] as [number, number, number],
  }));
}

export function nearestZoneForPosition(position: [number, number, number]): AgentHomeZone {
  const zones = Object.keys(ZONE_ANCHORS) as AgentHomeZone[];
  let best: AgentHomeZone = 'side-a';
  let bestDist = Infinity;
  for (const zone of zones) {
    const anchor = ZONE_ANCHORS[zone];
    const dist = Math.hypot(position[0] - anchor[0], position[2] - anchor[2]);
    if (dist < bestDist) {
      bestDist = dist;
      best = zone;
    }
  }
  return best;
}

export function nearestZoneWaypointIndex(
  zone: AgentHomeZone,
  position: [number, number, number],
): number {
  const list = getZoneWaypoints(zone);
  let best = 0;
  let bestDist = Infinity;
  list.forEach((waypoint, index) => {
    const dist = Math.hypot(position[0] - waypoint.position[0], position[2] - waypoint.position[2]);
    if (dist < bestDist) {
      bestDist = dist;
      best = index;
    }
  });
  return best;
}

export function getAgentChatAnchor(def: AgentDefinition): ChatAnchor {
  const slot = getPlayerSlot(def.id);
  return {
    position: [slot.position[0], slot.position[1], slot.position[2]],
    rotation: slot.rotation,
    posture: 'stand',
  };
}

export function getAgentSpawnAnchor(def: AgentDefinition): ChatAnchor {
  return getAgentChatAnchor(def);
}

export function getAgentPuffScale(_def?: AgentDefinition): number {
  return 1;
}

export function isNearChatAnchor(
  position: [number, number, number],
  anchor: ChatAnchor,
): boolean {
  const dx = position[0] - anchor.position[0];
  const dz = position[2] - anchor.position[2];
  return dx * dx + dz * dz <= ARRIVAL_RADIUS * ARRIVAL_RADIUS;
}

export const CHAT_ARRIVAL_RADIUS = ARRIVAL_RADIUS;

import type { IconName } from '@/components/ui/UiIcon';

export type PaddleZoneId = 'all' | 'side-a' | 'side-b' | 'bench';

export interface PaddleZoneLink {
  id: PaddleZoneId;
  label: string;
  shortLabel: string;
  sceneKey: 'overview' | 'SideA' | 'SideB' | 'Bench';
  icon: IconName;
  pan: [number, number, number];
  zoom: number;
  accent: string;
  identity?: {
    subtitle: string;
    plaquePosition: [number, number, number];
  };
  hotspot?: {
    position: [number, number, number];
    size: [number, number];
  };
}

export const PADDLE_ZONE_LINKS: PaddleZoneLink[] = [
  {
    id: 'all',
    label: 'Full Court',
    shortLabel: 'All',
    sceneKey: 'overview',
    icon: 'home',
    pan: [0, 0, 0],
    zoom: 1,
    accent: '#7eb6ff',
  },
  {
    id: 'side-a',
    label: 'Side A',
    shortLabel: 'A',
    sceneKey: 'SideA',
    icon: 'side-a',
    pan: [0, 0, 2.15],
    zoom: 0.78,
    accent: '#8eb7ff',
    identity: {
      subtitle: 'Near pair',
      plaquePosition: [0, 0, 4.55],
    },
    hotspot: { position: [0, 0.015, 2.4], size: [4.2, 3.4] },
  },
  {
    id: 'side-b',
    label: 'Side B',
    shortLabel: 'B',
    sceneKey: 'SideB',
    icon: 'side-b',
    pan: [0, 0, -2.15],
    zoom: 0.78,
    accent: '#e7c89a',
    identity: {
      subtitle: 'Far pair',
      plaquePosition: [0, 0, -4.55],
    },
    hotspot: { position: [0, 0.015, -2.4], size: [4.2, 3.4] },
  },
  {
    id: 'bench',
    label: 'Bench',
    shortLabel: 'Bench',
    sceneKey: 'Bench',
    icon: 'bench',
    pan: [0, 0, 5.7],
    zoom: 0.86,
    accent: '#d7c4a4',
    identity: {
      subtitle: 'Between points',
      plaquePosition: [1.7, 0, 6.15],
    },
    hotspot: { position: [0, 0.015, 6.15], size: [2.6, 1.2] },
  },
];

export const PADDLE_HOTSPOT_ZONES = PADDLE_ZONE_LINKS.filter((z) => z.hotspot);

export const PADDLE_WORK_ZONES = PADDLE_ZONE_LINKS.filter((z) => z.id !== 'all');

export function getPaddleZone(id: PaddleZoneId): PaddleZoneLink | undefined {
  return PADDLE_ZONE_LINKS.find((z) => z.id === id);
}

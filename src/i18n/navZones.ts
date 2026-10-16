import type { PaddleZoneId } from '@/config/paddleZones';
import type { TranslationKey } from './types';

export const NAV_ZONE_LABEL_KEYS: Record<PaddleZoneId, TranslationKey> = {
  all: 'nav.all',
  'side-a': 'nav.sideA',
  'side-b': 'nav.sideB',
  bench: 'nav.bench',
};

export type WorkZoneId = Exclude<PaddleZoneId, 'all'>;

export const ZONE_PLAQUE_LABEL_KEYS: Record<WorkZoneId, TranslationKey> = {
  'side-a': 'zones.sideA.label',
  'side-b': 'zones.sideB.label',
  bench: 'zones.bench.label',
};

export const ZONE_SUBTITLE_KEYS: Record<WorkZoneId, TranslationKey> = {
  'side-a': 'zones.sideA.subtitle',
  'side-b': 'zones.sideB.subtitle',
  bench: 'zones.bench.subtitle',
};

export const COMMAND_HINT_KEYS = [
  'commands.coffee',
  'commands.relax',
  'commands.desk',
  'commands.focus',
] as const satisfies readonly TranslationKey[];

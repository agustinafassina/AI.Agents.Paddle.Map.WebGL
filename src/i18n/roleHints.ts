import type { AppLocale } from './types';
import { translate } from './translate';
import type { TranslationKey } from './types';

const ROLE_HINT_KEYS: Record<string, TranslationKey[]> = {
  'nico-agent': ['roles.nico.hint1', 'roles.nico.hint2'],
  'luna-agent': ['roles.luna.hint1', 'roles.luna.hint2'],
  'mateo-agent': ['roles.mateo.hint1', 'roles.mateo.hint2'],
  'sofia-agent': ['roles.sofia.hint1', 'roles.sofia.hint2'],
};

export function getRoleHints(locale: AppLocale, agentId: string): string[] {
  const keys = ROLE_HINT_KEYS[agentId];
  if (!keys) return [];
  return keys.map((key) => translate(locale, key));
}

import { formatPointScore, getPlayerSlot } from '@/config/courtLayout';
import type { PaddleZoneId } from '@/config/paddleZones';
import { useMatchStore } from '@/stores/match.store';
import { NAV_ZONE_LABEL_KEYS } from '@/i18n/navZones';
import { translate } from '@/i18n/translate';
import type { AppLocale, TranslationKey } from '@/i18n/types';
import type { AgentDefinition, AgentRuntimeState, AgentStatus } from '@/types/agent';
import type { LiteLLMModel } from '@/types/litellm';
import { resolveAgentModelLabel } from '@/utils/agentModel';

const STATUS_LABEL_KEYS: Record<AgentStatus, TranslationKey> = {
  idle: 'avatar.available',
  walking: 'avatar.moving',
  chatting: 'avatar.inChat',
  coffee: 'avatar.coffeeBreak',
  'coffee-queue': 'avatar.inLine',
};

export interface AgentSceneContextInput {
  agent: AgentDefinition;
  runtime?: AgentRuntimeState;
  focusedZoneId: PaddleZoneId;
  followAgentId: string | null;
  locale: AppLocale;
  serviceMode: 'mock' | 'live' | 'error';
  models: LiteLLMModel[];
}

function zoneLabel(locale: AppLocale, zoneId: PaddleZoneId): string {
  return translate(locale, NAV_ZONE_LABEL_KEYS[zoneId]);
}

function statusLabel(locale: AppLocale, status: AgentStatus): string {
  return translate(locale, STATUS_LABEL_KEYS[status]);
}

export function buildSceneContextBlock(input: AgentSceneContextInput): string {
  const { agent, runtime, focusedZoneId, followAgentId, locale, serviceMode, models } = input;

  const modelLabel = resolveAgentModelLabel(agent.modelId, models, serviceMode);
  const match = useMatchStore.getState();
  const slot = getPlayerSlot(agent.id);
  const lines = [
    translate(locale, 'sceneContext.header'),
    `- ${translate(locale, 'sceneContext.role')}: ${agent.role}`,
    `- ${translate(locale, 'sceneContext.model')}: ${modelLabel}`,
    `- ${translate(locale, 'sceneContext.homeZone')}: ${zoneLabel(locale, agent.homeZone)}`,
    `- ${translate(locale, 'sceneContext.side')}: ${slot.team === 'a' ? 'A' : 'B'}`,
    `- ${translate(locale, 'sceneContext.score')}: A ${match.gamesA} (${formatPointScore(match.pointsA)}) · B ${match.gamesB} (${formatPointScore(match.pointsB)})`,
  ];

  if (runtime) {
    lines.push(
      `- ${translate(locale, 'sceneContext.status')}: ${statusLabel(locale, runtime.status)}`,
    );
    if (runtime.posture === 'sit') {
      lines.push(
        `- ${translate(locale, 'sceneContext.posture')}: ${translate(locale, 'sceneContext.postureSit')}`,
      );
    }
  }

  lines.push(
    `- ${translate(locale, 'sceneContext.mapZone')}: ${zoneLabel(locale, focusedZoneId)}`,
  );

  if (followAgentId === agent.id) {
    lines.push(`- ${translate(locale, 'sceneContext.userFollowing')}`);
  }

  lines.push(translate(locale, 'sceneContext.footer'));

  return lines.join('\n');
}

export function buildSystemPromptWithSceneContext(
  basePrompt: string | undefined,
  input: AgentSceneContextInput,
): string {
  const context = buildSceneContextBlock(input);
  const directReplyRule = translate(input.locale, 'sceneContext.directReplyRule');
  const parts = [basePrompt?.trim(), context, directReplyRule].filter(Boolean);
  return parts.join('\n\n');
}

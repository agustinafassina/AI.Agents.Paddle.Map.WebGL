import { useMemo, useState, startTransition } from 'react';
import { env } from '@/config/env';
import { useConnectionLabel } from '@/i18n/connectionLabel';
import { useTranslation } from '@/i18n';
import { useChatStore } from '@/stores/chat.store';
import { useAgentInteractionLogStore } from '@/stores/agentInteractionLog.store';
import { useAgentsStore } from '@/stores/agents.store';
import { useSceneStore } from '@/stores/scene.store';
import type { AgentDefinition } from '@/types/agent';
import { preloadChatAssets } from '@/utils/preloadChatPanel';
import { AgentHudCard } from './AgentHudCard';
import { AgentLogPanel } from './AgentLogPanel';
import { AgentPickerModal } from './AgentPickerModal';
import { GraphicsQualityToggle } from './GraphicsQualityToggle';
import { LocaleToggle } from './LocaleToggle';
import './PaddleHud.css';

const HUD_AGENT_PREVIEW_LIMIT = 3;

function getPreviewAgents(agents: AgentDefinition[], selectedAgentId: string | null) {
  if (agents.length <= HUD_AGENT_PREVIEW_LIMIT) {
    return agents;
  }

  const selectedIndex = agents.findIndex((agent) => agent.id === selectedAgentId);
  if (selectedIndex >= 0 && selectedIndex < HUD_AGENT_PREVIEW_LIMIT) {
    return agents.slice(0, HUD_AGENT_PREVIEW_LIMIT);
  }

  if (selectedIndex >= HUD_AGENT_PREVIEW_LIMIT) {
    const selected = agents[selectedIndex];
    return [...agents.slice(0, HUD_AGENT_PREVIEW_LIMIT - 1), selected];
  }

  return agents.slice(0, HUD_AGENT_PREVIEW_LIMIT);
}

export function PaddleHud() {
  const { t } = useTranslation();
  const connectionLabel = useConnectionLabel(useChatStore((state) => state.connectionStatus));
  const serviceMode = useChatStore((state) => state.serviceMode);
  const connectionStatus = useChatStore((state) => state.connectionStatus);
  const models = useChatStore((state) => state.models);
  const agents = useAgentsStore((state) => state.definitions);
  const focusOnAgent = useSceneStore((state) => state.focusOnAgent);
  const selectedAgentId = useSceneStore((state) => state.selectedAgentId);
  const openChat = useChatStore((state) => state.openChat);
  const agentLogTurnCount = useAgentInteractionLogStore((state) => state.turnCount);
  const downloadAgentLog = useAgentInteractionLogStore((state) => state.downloadTxt);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);

  const hasOverflow = agents.length > HUD_AGENT_PREVIEW_LIMIT;
  const previewAgents = useMemo(
    () => getPreviewAgents(agents, selectedAgentId),
    [agents, selectedAgentId],
  );
  const overflowCount = agents.length - HUD_AGENT_PREVIEW_LIMIT;

  const handleAgentSelect = (agentId: string) => {
    focusOnAgent(agentId);
    startTransition(() => {
      openChat(agentId);
    });
  };

  const handleAgentHover = () => {
    preloadChatAssets({ markdown: true });
  };

  return (
    <>
      <div className="paddle-hud">
        <div className="paddle-hud__brand">
          <span className="paddle-hud__eyebrow">{t('hud.eyebrow')}</span>
          <div className="paddle-hud__header">
            <span className="paddle-hud__title">{t('hud.title')}</span>
            <div className="paddle-hud__controls">
              <LocaleToggle />
              <GraphicsQualityToggle />
            </div>
          </div>
          <span className="paddle-hud__hint">{t('hud.hint')}</span>
          <div className="paddle-hud__agents" role="group" aria-label={t('hud.agentsAriaLabel')}>
            {connectionStatus === 'connecting' && (
              <span className="paddle-hud__loading">{t('hud.loadingAgents')}</span>
            )}
            {connectionStatus !== 'connecting' && agents.length === 0 && (
              <span className="paddle-hud__loading">{t('hud.noAgents')}</span>
            )}
            {previewAgents.map((agent) => (
              <AgentHudCard
                key={agent.id}
                agent={agent}
                selected={selectedAgentId === agent.id}
                onClick={() => handleAgentSelect(agent.id)}
                onHover={handleAgentHover}
              />
            ))}
            {hasOverflow && (
              <button
                type="button"
                className="paddle-hud__view-more"
                onClick={() => setPickerOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={pickerOpen}
              >
                <span className="paddle-hud__view-more-icon" aria-hidden>
                  +
                </span>
                <span className="paddle-hud__view-more-label">{t('hud.viewMore')}</span>
                <span className="paddle-hud__view-more-count">+{overflowCount}</span>
              </button>
            )}
          </div>
        </div>
        <div className="paddle-hud__status">
          <span className={`paddle-hud__dot paddle-hud__dot--${connectionStatus}`} />
          <span>
            {serviceMode === 'mock' ? t('hud.mockMode') : t('hud.litellm')} · {connectionLabel}
            {serviceMode === 'live' &&
              models.length > 0 &&
              ` · ${t('hud.modelsCount', { count: models.length })}`}
            {agentLogTurnCount > 0 &&
              ` · ${t('hud.agentLogCount', { count: agentLogTurnCount })}`}
          </span>
          {!env.useMockLitellm && env.litellmApiKey && (
            <span className="paddle-hud__live">{t('hud.apiConfigured')}</span>
          )}
          <div className="paddle-hud__log-actions">
            <button
              type="button"
              className="paddle-hud__log-btn paddle-hud__log-btn--primary"
              onClick={() => setLogOpen(true)}
              aria-label={t('hud.viewAgentLogAria')}
              aria-haspopup="dialog"
              aria-expanded={logOpen}
            >
              {t('hud.viewAgentLog')}
            </button>
            <button
              type="button"
              className="paddle-hud__log-btn"
              onClick={() => downloadAgentLog()}
              disabled={agentLogTurnCount === 0}
              title={agentLogTurnCount === 0 ? t('hud.agentLogEmpty') : undefined}
              aria-label={t('hud.downloadAgentLogAria')}
            >
              {t('hud.downloadAgentLog')}
            </button>
          </div>
        </div>
      </div>

      <AgentLogPanel open={logOpen} onClose={() => setLogOpen(false)} />

      <AgentPickerModal
        open={pickerOpen}
        agents={agents}
        selectedAgentId={selectedAgentId}
        onClose={() => setPickerOpen(false)}
        onSelect={handleAgentSelect}
      />
    </>
  );
}

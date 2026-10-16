import { create } from 'zustand';
import { getPlayerSlot } from '@/config/courtLayout';
import { getAgentChatAnchor, getAgentSpawnAnchor } from '@/config/agentZones.config';
import type { AppLocale } from '@/i18n/types';
import type { AgentDefinition, AgentRuntimeState, AgentStatus } from '@/types/agent';
import { applyLocaleToAgents } from '@/utils/applyAgentLocale';
import { readLocale } from '@/utils/localeStorage';
import { lerpAngle, lerpPosition } from '@/utils/movement';
import type { AgentChatCommand } from '@/utils/chatAgentCommands';
import { useMatchStore } from '@/stores/match.store';

interface AgentsStore {
  baseDefinitions: AgentDefinition[];
  definitions: AgentDefinition[];
  runtime: Record<string, AgentRuntimeState>;
  idleTimers: Record<string, number>;
  setDefinitions: (definitions: AgentDefinition[]) => void;
  applyLocale: (locale: AppLocale) => void;
  initialize: () => void;
  tick: (delta: number) => void;
  beginChatSession: (id: string) => void;
  endChatSession: (id: string) => void;
  dispatchAgentCommand: (id: string, command: AgentChatCommand) => boolean;
  setAgentStatus: (id: string, status: AgentStatus) => void;
  setAgentModelId: (id: string, modelId: string) => void;
  getRuntime: (id: string) => AgentRuntimeState | undefined;
}

function createInitialRuntime(def: AgentDefinition): AgentRuntimeState {
  const anchor = getAgentSpawnAnchor(def);
  return {
    id: def.id,
    status: 'idle',
    position: [...anchor.position],
    targetPosition: null,
    waypointIndex: 0,
    rotation: anchor.rotation,
    moveSpeed: 0,
    pendingChat: false,
    pendingCoffee: false,
    coffeeTimer: 0,
    coffeeQueueTicket: 0,
    posture: 'stand',
  };
}

function strikeGoal(agentId: string, shotT: number): [number, number, number] {
  const slot = getPlayerSlot(agentId);
  const dir = slot.team === 'a' ? -1 : 1;
  const reach = Math.sin(Math.min(Math.max(shotT, 0), 1) * Math.PI);
  return [slot.position[0], 0, slot.position[2] + dir * 0.42 * reach];
}

export const useAgentsStore = create<AgentsStore>((set, get) => ({
  baseDefinitions: [],
  definitions: [],
  runtime: {},
  idleTimers: {},

  setDefinitions: (definitions) => {
    const locale = readLocale();
    set({
      baseDefinitions: definitions,
      definitions: applyLocaleToAgents(definitions, locale),
    });
  },

  applyLocale: (locale) => {
    const { baseDefinitions } = get();
    if (baseDefinitions.length === 0) return;
    set({ definitions: applyLocaleToAgents(baseDefinitions, locale) });
  },

  setAgentModelId: (id, modelId) => {
    const mapModel = (agent: AgentDefinition) =>
      agent.id === id ? { ...agent, modelId } : agent;
    set({
      baseDefinitions: get().baseDefinitions.map(mapModel),
      definitions: get().definitions.map(mapModel),
    });
  },

  initialize: () => {
    const runtime: Record<string, AgentRuntimeState> = {};
    for (const def of get().definitions) {
      runtime[def.id] = createInitialRuntime(def);
    }
    set({ runtime, idleTimers: {} });
  },

  beginChatSession: (id) => {
    const current = get().runtime[id];
    const def = get().definitions.find((agent) => agent.id === id);
    if (!current || !def) return;
    const anchor = getAgentChatAnchor(def);
    set({
      runtime: {
        ...get().runtime,
        [id]: {
          ...current,
          status: 'chatting',
          position: [...anchor.position],
          targetPosition: null,
          rotation: anchor.rotation,
          moveSpeed: 0,
          pendingChat: true,
          posture: 'stand',
        },
      },
    });
  },

  endChatSession: (id) => {
    const current = get().runtime[id];
    const def = get().definitions.find((agent) => agent.id === id);
    if (!current || !def) return;
    const slot = getPlayerSlot(def.id);
    set({
      runtime: {
        ...get().runtime,
        [id]: {
          ...current,
          status: 'idle',
          targetPosition: [...slot.position],
          pendingChat: false,
          posture: 'stand',
        },
      },
    });
  },

  dispatchAgentCommand: () => false,

  setAgentStatus: (id, status) => {
    const current = get().runtime[id];
    if (!current) return;
    set({
      runtime: {
        ...get().runtime,
        [id]: {
          ...current,
          status,
          posture: 'stand',
        },
      },
    });
  },

  getRuntime: (id) => get().runtime[id],

  tick: (delta) => {
    const dt = Math.min(delta, 0.05);
    const { runtime, definitions } = get();
    if (definitions.length === 0) return;

    const match = useMatchStore.getState();
    const hitting =
      match.hitterId !== null && (match.phase === 'serve' || match.phase === 'rally');
    const nextRuntime: Record<string, AgentRuntimeState> = { ...runtime };

    for (const def of definitions) {
      const state = runtime[def.id];
      if (!state) continue;
      const slot = getPlayerSlot(def.id);
      const isHitter = hitting && match.hitterId === def.id;
      const chatting = state.status === 'chatting';
      const goal = isHitter && !chatting ? strikeGoal(def.id, match.shotT) : slot.position;
      const blend = 1 - Math.exp(-9 * dt);
      const position = lerpPosition(state.position, goal, blend);
      const moved = Math.hypot(goal[0] - state.position[0], goal[2] - state.position[2]);
      const face = isHitter ? goal : slot.position;
      const targetRotation =
        isHitter && moved > 0.04
          ? Math.atan2(face[0] - state.position[0], face[2] - state.position[2])
          : slot.rotation;
      const rotation = lerpAngle(state.rotation, targetRotation, blend);
      let status: AgentStatus = chatting ? 'chatting' : 'idle';
      if (!chatting && isHitter && moved > 0.08) status = 'walking';

      nextRuntime[def.id] = {
        ...state,
        status,
        position,
        targetPosition: isHitter ? goal : null,
        rotation,
        moveSpeed: isHitter ? 1.1 : 0,
        posture: 'stand',
      };
    }

    set({ runtime: nextRuntime });
  },
}));

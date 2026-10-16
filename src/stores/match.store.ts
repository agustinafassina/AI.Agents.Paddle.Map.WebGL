import { create } from 'zustand';
import {
  contactPoint,
  teamOfAgent,
  winnerLanding,
  type CourtTeam,
} from '@/config/courtLayout';

export type MatchPhase = 'between' | 'serve' | 'rally' | 'point';
export type PointScore = 0 | 1 | 2 | 3;

const BETWEEN_SEC = 5.4;
const POINT_HOLD_SEC = 0.75;
const SHOT_SEC = 0.92;

const RALLIES: string[][] = [
  ['nico-agent', 'mateo-agent', 'luna-agent', 'sofia-agent', 'nico-agent'],
  ['luna-agent', 'sofia-agent', 'nico-agent', 'mateo-agent'],
  ['mateo-agent', 'nico-agent', 'sofia-agent', 'luna-agent', 'mateo-agent', 'nico-agent'],
  ['sofia-agent', 'luna-agent', 'mateo-agent', 'nico-agent', 'sofia-agent'],
  ['nico-agent', 'sofia-agent', 'luna-agent', 'mateo-agent', 'nico-agent', 'sofia-agent', 'luna-agent'],
  ['luna-agent', 'mateo-agent', 'nico-agent', 'sofia-agent', 'luna-agent', 'mateo-agent'],
  ['mateo-agent', 'luna-agent', 'sofia-agent', 'nico-agent'],
  ['sofia-agent', 'nico-agent', 'mateo-agent', 'luna-agent', 'sofia-agent', 'nico-agent', 'mateo-agent'],
];

interface MatchStore {
  phase: MatchPhase;
  phaseTime: number;
  shotIndex: number;
  shotT: number;
  script: string[];
  ball: [number, number, number];
  hitterId: string | null;
  serverTeam: CourtTeam;
  pointsA: PointScore;
  pointsB: PointScore;
  gamesA: number;
  gamesB: number;
  tick: (delta: number, paused: boolean) => void;
}

function pickScript(serverTeam: CourtTeam): string[] {
  const pool = RALLIES.filter((script) => teamOfAgent(script[0]) === serverTeam);
  const choice = pool[Math.floor(Math.random() * pool.length)] ?? RALLIES[0];
  return [...choice];
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function ballOnShot(script: string[], shotIndex: number, t: number): [number, number, number] {
  const hitterId = script[shotIndex];
  const from = contactPoint(hitterId);
  const isLast = shotIndex >= script.length - 1;
  const to = isLast ? winnerLanding(hitterId) : contactPoint(script[shotIndex + 1]);
  const arc = Math.sin(Math.PI * t) * (isLast ? 1.05 : 1.35);
  const y = isLast ? lerp(from[1], to[1], t) + arc : from[1] + arc;
  return [lerp(from[0], to[0], t), y, lerp(from[2], to[2], t)];
}

function awardPoint(
  team: CourtTeam,
  pointsA: PointScore,
  pointsB: PointScore,
  gamesA: number,
  gamesB: number,
): Pick<MatchStore, 'pointsA' | 'pointsB' | 'gamesA' | 'gamesB' | 'serverTeam'> {
  let nextA = pointsA;
  let nextB = pointsB;
  let nextGamesA = gamesA;
  let nextGamesB = gamesB;
  let serverTeam: CourtTeam = team === 'a' ? 'b' : 'a';

  if (team === 'a') {
    if (pointsA >= 3) {
      nextGamesA += 1;
      nextA = 0;
      nextB = 0;
    } else {
      nextA = (pointsA + 1) as PointScore;
      serverTeam = team === 'a' ? 'b' : 'a';
    }
  } else if (pointsB >= 3) {
    nextGamesB += 1;
    nextA = 0;
    nextB = 0;
  } else {
    nextB = (pointsB + 1) as PointScore;
  }

  if ((team === 'a' && pointsA >= 3) || (team === 'b' && pointsB >= 3)) {
    serverTeam = team === 'a' ? 'b' : 'a';
  } else {
    serverTeam = team === 'a' ? 'b' : 'a';
  }

  return {
    pointsA: nextA,
    pointsB: nextB,
    gamesA: nextGamesA,
    gamesB: nextGamesB,
    serverTeam,
  };
}

const opening = pickScript('a');

export const useMatchStore = create<MatchStore>((set, get) => ({
  phase: 'serve',
  phaseTime: 0,
  shotIndex: 0,
  shotT: 0,
  script: opening,
  ball: contactPoint(opening[0]),
  hitterId: opening[0],
  serverTeam: 'a',
  pointsA: 0,
  pointsB: 0,
  gamesA: 0,
  gamesB: 0,

  tick: (delta, paused) => {
    if (paused) return;
    const dt = Math.min(delta, 0.05);
    const state = get();

    if (state.phase === 'between') {
      const phaseTime = state.phaseTime + dt;
      if (phaseTime < BETWEEN_SEC) {
        set({ phaseTime, hitterId: null });
        return;
      }
      const script = pickScript(state.serverTeam);
      set({
        phase: 'serve',
        phaseTime: 0,
        shotIndex: 0,
        shotT: 0,
        script,
        hitterId: script[0],
        ball: contactPoint(script[0]),
      });
      return;
    }

    if (state.phase === 'point') {
      const phaseTime = state.phaseTime + dt;
      if (phaseTime < POINT_HOLD_SEC) {
        set({ phaseTime, hitterId: null });
        return;
      }
      set({ phase: 'between', phaseTime: 0, hitterId: null });
      return;
    }

    const shotT = state.shotT + dt / SHOT_SEC;
    if (shotT < 1) {
      set({
        shotT,
        hitterId: state.script[state.shotIndex] ?? null,
        ball: ballOnShot(state.script, state.shotIndex, shotT),
      });
      return;
    }

    const last = state.shotIndex >= state.script.length - 1;
    if (!last) {
      const shotIndex = state.shotIndex + 1;
      set({
        phase: 'rally',
        shotIndex,
        shotT: 0,
        hitterId: state.script[shotIndex],
        ball: contactPoint(state.script[shotIndex]),
      });
      return;
    }

    const winnerId = state.script[state.script.length - 1];
    const scored = awardPoint(
      teamOfAgent(winnerId),
      state.pointsA,
      state.pointsB,
      state.gamesA,
      state.gamesB,
    );
    set({
      phase: 'point',
      phaseTime: 0,
      shotT: 1,
      hitterId: null,
      ball: winnerLanding(winnerId),
      ...scored,
    });
  },
}));

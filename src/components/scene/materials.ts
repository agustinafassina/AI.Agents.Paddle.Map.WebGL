import * as THREE from 'three';
import { PADDLE_PALETTE } from '@/config/agents.config';
import { getPaddleTextures } from '@/utils/textures/proceduralTextures';

export const OUTLINE_COLOR = PADDLE_PALETTE.outline;

export function softColor(
  color: string,
  opts?: {
    emissive?: string;
    emissiveIntensity?: number;
    map?: THREE.Texture | null;
    roughness?: number;
    metalness?: number;
  },
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    map: opts?.map ?? null,
    roughness: opts?.roughness ?? 0.96,
    metalness: opts?.metalness ?? 0.01,
    emissive: new THREE.Color(opts?.emissive ?? '#000000'),
    emissiveIntensity: opts?.emissiveIntensity ?? 0,
  });
}

function buildMaterials() {
  const tex = getPaddleTextures();

  return {
    tileSage: softColor('#faf6f0', { map: tex.tileSage, roughness: 0.82 }),
    tileGray: softColor('#f2ebe2', { map: tex.tileGray, roughness: 0.8 }),
    tileGrout: softColor(PADDLE_PALETTE.tileGrout, { roughness: 0.95 }),
    floorPlatform: softColor(PADDLE_PALETTE.floorPlatform, { map: tex.tileGray, roughness: 0.88 }),
    wall: softColor('#ffffff', { map: tex.wallPlaster, roughness: 0.94 }),
    wallMarble: softColor('#ffffff', { map: tex.wallMarble, roughness: 0.78 }),
    wallStripe: softColor(PADDLE_PALETTE.wallStripe, { roughness: 0.9 }),
    wallAccent: softColor(PADDLE_PALETTE.wallAccent, { map: tex.wallPlaster, roughness: 0.9 }),
    wood: softColor(PADDLE_PALETTE.wood, { map: tex.woodGrain, roughness: 0.78 }),
    woodLight: softColor(PADDLE_PALETTE.woodLight, { map: tex.woodGrain, roughness: 0.72 }),
    woodDark: softColor(PADDLE_PALETTE.woodDark, { map: tex.woodGrainDark, roughness: 0.74 }),
    deskTop: softColor('#ffffff', { map: tex.woodGrain, roughness: 0.68 }),
    deskLeg: softColor(PADDLE_PALETTE.deskLeg, { roughness: 0.4, metalness: 0.2 }),
    monitor: softColor(PADDLE_PALETTE.monitor, {
      emissive: PADDLE_PALETTE.monitorGlow,
      emissiveIntensity: 0.4,
      roughness: 0.24,
      metalness: 0.32,
    }),
    monitorBezel: softColor(PADDLE_PALETTE.monitor, { roughness: 0.35, metalness: 0.25 }),
    sage: softColor(PADDLE_PALETTE.sage, { map: tex.plantFoliage, roughness: 0.88 }),
    sageDark: softColor(PADDLE_PALETTE.sageDark, { map: tex.plantFoliage, roughness: 0.9 }),
    terracotta: softColor(PADDLE_PALETTE.terracotta, { roughness: 0.8 }),
    terracottaLight: softColor(PADDLE_PALETTE.terracottaLight, { roughness: 0.78 }),
    plant: softColor('#ffffff', { map: tex.plantFoliage, roughness: 0.92 }),
    plantDark: softColor(PADDLE_PALETTE.plantDark, { map: tex.plantFoliage, roughness: 0.94 }),
    plantPot: softColor(PADDLE_PALETTE.plantPot, { roughness: 0.7 }),
    potCeramic: softColor(PADDLE_PALETTE.potCeramic, { roughness: 0.32, metalness: 0.02 }),
    whiteboard: softColor(PADDLE_PALETTE.whiteboard, { roughness: 0.28 }),
    woodTable: softColor('#ffffff', { map: tex.woodGrainDark, roughness: 0.66 }),
    rug: softColor('#ffffff', { map: tex.rugJute, roughness: 0.98 }),
    rugWeave: softColor('#ffffff', { map: tex.rugWeave, roughness: 0.98 }),
    metal: softColor(PADDLE_PALETTE.metal, { roughness: 0.28, metalness: 0.65 }),
    espresso: softColor(PADDLE_PALETTE.espresso, { roughness: 0.62 }),
    stringLight: softColor(PADDLE_PALETTE.stringLight, {
      emissive: PADDLE_PALETTE.stringLight,
      emissiveIntensity: 1,
    }),
    underGlow: softColor(PADDLE_PALETTE.underGlow, {
      emissive: PADDLE_PALETTE.underGlow,
      emissiveIntensity: 0.65,
    }),
    chairMesh: softColor(PADDLE_PALETTE.chairMesh, { roughness: 0.52 }),
    chairTan: softColor(PADDLE_PALETTE.chairTan, { roughness: 0.7 }),
    chairCream: softColor(PADDLE_PALETTE.chairCream, { roughness: 0.72 }),
    chairWhite: softColor(PADDLE_PALETTE.chairWhite, { roughness: 0.68 }),
    chairForest: softColor(PADDLE_PALETTE.chairForest, { roughness: 0.74 }),
    chairYellow: softColor(PADDLE_PALETTE.chairYellow, { roughness: 0.72 }),
    stoolGray: softColor(PADDLE_PALETTE.stoolGray, { roughness: 0.62 }),
    platformWood: softColor(PADDLE_PALETTE.platformWood, { map: tex.woodGrain, roughness: 0.76 }),
    olive: softColor(PADDLE_PALETTE.olive, { roughness: 0.82 }),
    zoneMatSage: softColor(PADDLE_PALETTE.zoneMatSage, { map: tex.tileSage, roughness: 0.9 }),
    mossMat: softColor(PADDLE_PALETTE.mossMat, { map: tex.plantFoliage, roughness: 0.94 }),
    foliageDeep: softColor(PADDLE_PALETTE.foliageDeep, { map: tex.plantFoliage, roughness: 0.93 }),
    terracottaPot: softColor(PADDLE_PALETTE.terracottaPot, { roughness: 0.78 }),
    creamCeramic: softColor(PADDLE_PALETTE.creamCeramic, { roughness: 0.38, metalness: 0.02 }),
    softBloom: softColor(PADDLE_PALETTE.softBloom, {
      emissive: PADDLE_PALETTE.softBloom,
      emissiveIntensity: 0.35,
      roughness: 0.55,
    }),
    glass: softColor(PADDLE_PALETTE.glass, {
      emissive: '#a0d0d8',
      emissiveIntensity: 0.15,
      roughness: 0.12,
      metalness: 0.08,
    }),
    matTransition: softColor(PADDLE_PALETTE.matTransition, { map: tex.rugWeave, roughness: 0.92 }),
    beanBagTerracotta: softColor(PADDLE_PALETTE.terracotta, { map: tex.rugWeave, roughness: 0.94 }),
    beanBagTerracottaLight: softColor(PADDLE_PALETTE.terracottaLight, { map: tex.rugWeave, roughness: 0.93 }),
    beanBagSage: softColor(PADDLE_PALETTE.sage, { map: tex.rugWeave, roughness: 0.94 }),
    beanBagOlive: softColor(PADDLE_PALETTE.olive, { map: tex.rugWeave, roughness: 0.94 }),
    chairTerracotta: softColor(PADDLE_PALETTE.terracottaLight, { roughness: 0.68 }),
    mug: softColor(PADDLE_PALETTE.mug, { roughness: 0.35 }),
    notebook: softColor(PADDLE_PALETTE.notebook, { roughness: 0.84 }),
  };
}

export const materials = buildMaterials();

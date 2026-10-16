import { useMemo } from 'react';
import * as THREE from 'three';
import {
  COURT_HALF_L,
  COURT_HALF_W,
  COURT_LENGTH,
  COURT_WIDTH,
  GLASS_HEIGHT,
  SERVICE_Z,
} from '@/config/courtLayout';
import { CourtScoreSign } from './CourtScoreSign';
import { MatchBall } from './MatchBall';

const TURF = '#1d4ed8';
const TURF_DARK = '#163a9a';
const LINE = '#f4f7fb';
const METAL = '#2c3440';
const METAL_LIGHT = '#8b97a6';
const GLASS = '#c5dff0';

function LineBox({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <mesh position={position} receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={LINE} roughness={0.45} />
    </mesh>
  );
}

function CourtLines() {
  const y = 0.025;
  const t = 0.045;
  return (
    <group>
      <LineBox position={[0, y, 0]} size={[COURT_WIDTH, 0.012, t]} />
      <LineBox position={[0, y, COURT_HALF_L]} size={[COURT_WIDTH, 0.012, t]} />
      <LineBox position={[0, y, -COURT_HALF_L]} size={[COURT_WIDTH, 0.012, t]} />
      <LineBox position={[COURT_HALF_W, y, 0]} size={[t, 0.012, COURT_LENGTH]} />
      <LineBox position={[-COURT_HALF_W, y, 0]} size={[t, 0.012, COURT_LENGTH]} />
      <LineBox position={[0, y, SERVICE_Z]} size={[COURT_WIDTH, 0.01, t * 0.85]} />
      <LineBox position={[0, y, -SERVICE_Z]} size={[COURT_WIDTH, 0.01, t * 0.85]} />
      <LineBox position={[0, y, SERVICE_Z / 2]} size={[t * 0.8, 0.01, SERVICE_Z]} />
      <LineBox position={[0, y, -SERVICE_Z / 2]} size={[t * 0.8, 0.01, SERVICE_Z]} />
    </group>
  );
}

function GlassPane({
  position,
  rotation = [0, 0, 0] as [number, number, number],
  size,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  size: [number, number];
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshStandardMaterial
        color={GLASS}
        transparent
        opacity={0.22}
        roughness={0.08}
        metalness={0.15}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function MeshFence({
  position,
  rotation = [0, 0, 0] as [number, number, number],
  width,
  gap,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  width: number;
  gap?: [number, number];
}) {
  const posts = [];
  const rails = [0.35, 0.85, 1.35, 1.85];
  const step = 0.42;
  for (let x = -width / 2; x <= width / 2 + 0.01; x += step) {
    if (gap && x > gap[0] && x < gap[1]) continue;
    posts.push(x);
  }

  return (
    <group position={position} rotation={rotation}>
      {posts.map((x) => (
        <mesh key={`p-${x.toFixed(2)}`} position={[x, GLASS_HEIGHT / 2, 0]} castShadow>
          <boxGeometry args={[0.025, GLASS_HEIGHT, 0.025]} />
          <meshStandardMaterial color={METAL_LIGHT} metalness={0.55} roughness={0.35} />
        </mesh>
      ))}
      {rails.map((y) => (
        <mesh key={`r-${y}`} position={[0, y, 0]}>
          <boxGeometry args={[width, 0.02, 0.02]} />
          <meshStandardMaterial color={METAL_LIGHT} metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function Post({ position, height = GLASS_HEIGHT }: { position: [number, number, number]; height?: number }) {
  return (
    <mesh position={[position[0], height / 2, position[2]]} castShadow>
      <boxGeometry args={[0.08, height, 0.08]} />
      <meshStandardMaterial color={METAL} metalness={0.62} roughness={0.32} />
    </mesh>
  );
}

function Cage() {
  const zSide = COURT_HALF_L;
  const xSide = COURT_HALF_W;
  return (
    <group>
      <GlassPane position={[xSide, GLASS_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]} size={[COURT_LENGTH, GLASS_HEIGHT]} />
      <GlassPane position={[-xSide, GLASS_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]} size={[COURT_LENGTH, GLASS_HEIGHT]} />
      <MeshFence position={[0, 0, -zSide]} width={COURT_WIDTH} />
      <MeshFence position={[0, 0, zSide]} rotation={[0, Math.PI, 0]} width={COURT_WIDTH} gap={[-0.7, 0.7]} />
      <Post position={[xSide, 0, zSide]} />
      <Post position={[-xSide, 0, zSide]} />
      <Post position={[xSide, 0, -zSide]} />
      <Post position={[-xSide, 0, -zSide]} />
      <Post position={[xSide, 0, 0]} height={GLASS_HEIGHT} />
      <Post position={[-xSide, 0, 0]} height={GLASS_HEIGHT} />
    </group>
  );
}

function Net() {
  const cables = [];
  for (let x = -COURT_HALF_W; x <= COURT_HALF_W; x += 0.18) {
    cables.push(x);
  }
  return (
    <group>
      <mesh position={[-COURT_HALF_W - 0.02, 0.52, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.04, 1.05, 8]} />
        <meshStandardMaterial color={METAL} metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[COURT_HALF_W + 0.02, 0.52, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.04, 1.05, 8]} />
        <meshStandardMaterial color={METAL} metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.98, 0]}>
        <boxGeometry args={[COURT_WIDTH, 0.045, 0.04]} />
        <meshStandardMaterial color="#f7f7f5" roughness={0.4} />
      </mesh>
      {cables.map((x) => (
        <mesh key={x.toFixed(2)} position={[x, 0.62, 0]}>
          <boxGeometry args={[0.012, 0.7, 0.012]} />
          <meshStandardMaterial color="#e7eef2" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Floodlight({ position, target }: { position: [number, number, number]; target: [number, number, number] }) {
  return (
    <group>
      <mesh position={[position[0], 2.15, position[2]]} castShadow>
        <cylinderGeometry args={[0.035, 0.045, 4.3, 8]} />
        <meshStandardMaterial color={METAL} metalness={0.55} roughness={0.3} />
      </mesh>
      <mesh position={position} rotation={[0.5, 0, 0]} castShadow>
        <boxGeometry args={[0.55, 0.12, 0.28]} />
        <meshStandardMaterial color="#1c2430" metalness={0.4} roughness={0.35} emissive="#ffd7a1" emissiveIntensity={0.35} />
      </mesh>
      <spotLight
        position={position}
        angle={0.62}
        penumbra={0.75}
        intensity={3.2}
        color="#fff1d6"
        distance={16}
        decay={2}
        castShadow={false}
      >
        <object3D attach="target" position={target} />
      </spotLight>
    </group>
  );
}

function Bench() {
  return (
    <group position={[0, 0, 6.15]}>
      <mesh position={[-0.85, 0.22, 0]} castShadow>
        <boxGeometry args={[0.06, 0.44, 0.06]} />
        <meshStandardMaterial color={METAL} />
      </mesh>
      <mesh position={[0.85, 0.22, 0]} castShadow>
        <boxGeometry args={[0.06, 0.44, 0.06]} />
        <meshStandardMaterial color={METAL} />
      </mesh>
      <mesh position={[0, 0.46, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.1, 0.07, 0.42]} />
        <meshStandardMaterial color="#c4a574" roughness={0.62} />
      </mesh>
      <mesh position={[0, 0.72, -0.16]} castShadow>
        <boxGeometry args={[2.1, 0.42, 0.06]} />
        <meshStandardMaterial color="#d7c4a4" roughness={0.6} />
      </mesh>
    </group>
  );
}

function Turf() {
  const apron = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#1a2420', roughness: 0.92 }),
    [],
  );
  const turf = useMemo(
    () => new THREE.MeshStandardMaterial({ color: TURF, roughness: 0.86 }),
    [],
  );
  const inner = useMemo(
    () => new THREE.MeshStandardMaterial({ color: TURF_DARK, roughness: 0.84 }),
    [],
  );
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0.4]} receiveShadow material={apron}>
        <planeGeometry args={[16, 16]} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]} receiveShadow material={turf}>
        <planeGeometry args={[COURT_WIDTH + 0.08, COURT_LENGTH + 0.08]} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]} receiveShadow material={inner}>
        <planeGeometry args={[COURT_WIDTH - 0.55, COURT_LENGTH - 0.7]} />
      </mesh>
    </group>
  );
}

export function CourtLayout() {
  return (
    <group>
      <Turf />
      <CourtLines />
      <Cage />
      <Net />
      <Bench />
      <Floodlight position={[-3.35, 4.35, 3.4]} target={[0, 0.4, 1.2]} />
      <Floodlight position={[3.35, 4.35, 3.4]} target={[0, 0.4, 1.2]} />
      <Floodlight position={[-3.35, 4.35, -3.4]} target={[0, 0.4, -1.2]} />
      <Floodlight position={[3.35, 4.35, -3.4]} target={[0, 0.4, -1.2]} />
      <CourtScoreSign />
      <MatchBall />
    </group>
  );
}

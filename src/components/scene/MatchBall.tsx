import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';
import { useMatchStore } from '@/stores/match.store';

export function MatchBall() {
  const ballRef = useRef<Mesh>(null);
  const shadowRef = useRef<Mesh>(null);

  useFrame(() => {
    const [x, y, z] = useMatchStore.getState().ball;
    if (ballRef.current) {
      ballRef.current.position.set(x, y, z);
    }
    if (shadowRef.current) {
      shadowRef.current.position.set(x, 0.03, z);
      const height = Math.max(0, y - 0.2);
      const scale = 1 - Math.min(height / 3.2, 0.65);
      shadowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      <mesh ref={shadowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[0.11, 16]} />
        <meshBasicMaterial color="#061018" transparent opacity={0.35} depthWrite={false} />
      </mesh>
      <mesh ref={ballRef} castShadow position={[0, 1.05, 3.2]}>
        <sphereGeometry args={[0.075, 18, 14]} />
        <meshStandardMaterial color="#d6f25c" roughness={0.45} emissive="#8aaa20" emissiveIntensity={0.18} />
      </mesh>
    </group>
  );
}

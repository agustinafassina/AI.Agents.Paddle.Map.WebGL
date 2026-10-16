import { Text } from '@react-three/drei';
import { formatPointScore } from '@/config/courtLayout';
import { useMatchStore } from '@/stores/match.store';

export function CourtScoreSign() {
  const pointsA = useMatchStore((state) => state.pointsA);
  const pointsB = useMatchStore((state) => state.pointsB);
  const gamesA = useMatchStore((state) => state.gamesA);
  const gamesB = useMatchStore((state) => state.gamesB);
  const line = `${gamesA}  ${formatPointScore(pointsA)}  ·  ${formatPointScore(pointsB)}  ${gamesB}`;

  return (
    <group position={[0, 1.72, -5.42]}>
      <mesh castShadow>
        <boxGeometry args={[2.4, 0.62, 0.06]} />
        <meshStandardMaterial color="#121820" roughness={0.5} metalness={0.2} />
      </mesh>
      <Text
        position={[0, 0.02, 0.04]}
        fontSize={0.2}
        color="#f4f7fb"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.006}
        outlineColor="#0b1220"
      >
        {line}
      </Text>
    </group>
  );
}

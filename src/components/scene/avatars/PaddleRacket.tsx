export function PaddleRacket() {
  return (
    <group position={[0.01, -0.02, 0.05]} rotation={[0.35, 0.2, -0.7]}>
      <mesh castShadow>
        <boxGeometry args={[0.018, 0.12, 0.17]} />
        <meshStandardMaterial color="#163a86" roughness={0.4} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[0.012, 0.07, 0.012]} />
        <meshStandardMaterial color="#f4f7fb" roughness={0.35} />
      </mesh>
      <mesh position={[0, -0.1, 0]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.09, 6]} />
        <meshStandardMaterial color="#e7e2d8" roughness={0.45} />
      </mesh>
    </group>
  );
}

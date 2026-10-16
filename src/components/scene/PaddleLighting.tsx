import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { DirectionalLight } from 'three';

export function PaddleLighting() {
  const keyRef = useRef<DirectionalLight>(null);

  useFrame(({ clock }) => {
    if (keyRef.current) {
      keyRef.current.intensity = 0.42 + Math.sin(clock.elapsedTime * 0.18) * 0.03;
    }
  });

  return (
    <>
      <ambientLight intensity={0.34} color="#c9d7ea" />
      <hemisphereLight args={['#9eb6d4', '#1a2830', 0.38]} />
      <directionalLight
        ref={keyRef}
        position={[6, 14, 8]}
        intensity={0.42}
        color="#fff6e8"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.00008}
        shadow-radius={6}
        shadow-camera-far={36}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
    </>
  );
}

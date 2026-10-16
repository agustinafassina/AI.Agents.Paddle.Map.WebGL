import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { getPaddleTextures } from '@/utils/textures/proceduralTextures';

export function TextureWarmup() {
  const gl = useThree((s) => s.gl);

  useEffect(() => {
    const textures = getPaddleTextures();
    Object.values(textures).forEach((t) => {
      gl.initTexture(t);
    });
  }, [gl]);

  return null;
}
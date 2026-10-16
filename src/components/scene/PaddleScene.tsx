import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { lazy, Suspense, useMemo } from 'react';
import { PADDLE_PALETTE } from '@/config/agents.config';
import { useAgentMovement } from '@/hooks/useAgentMovement';
import { useGraphicsStore } from '@/stores/graphics.store';
import {
  isPostProcessingEnabled,
  presetToFlags,
  type GraphicsQualityFlags,
} from '@/types/graphics';
import { PaddleLayout } from './PaddleLayout';
import { PaddleLighting } from './PaddleLighting';
import { IsometricCamera } from './IsometricCamera';
import { AgentFollowCamera } from './AgentFollowCamera';
import { AgentsLayer } from './avatars/AgentsLayer';
import { CameraPanHandler } from './CameraPanHandler';
import { CameraZoomHandler } from './CameraZoomHandler';
import { TextureWarmup } from './TextureWarmup';
import { OptionalTextureLoader } from './OptionalTextureLoader';
import { PaddleZoneHotspots } from './PaddleZoneHotspots';
import { PaddleZoneIdentity } from './PaddleZoneIdentity';
import { SceneErrorBoundary } from './SceneErrorBoundary';

const PaddlePostProcessing = lazy(() =>
  import('./PaddlePostProcessing').then((module) => ({
    default: module.PaddlePostProcessing,
  })),
);

const BG = PADDLE_PALETTE.sceneBackground;

interface SceneContentsProps {
  qualityFlags: GraphicsQualityFlags;
  showPostProcessing: boolean;
}

function SceneContents({ qualityFlags, showPostProcessing }: SceneContentsProps) {
  useAgentMovement();

  return (
    <>
      <TextureWarmup />
      <OptionalTextureLoader />
      <IsometricCamera />
      <AgentFollowCamera />
      <CameraPanHandler />
      <CameraZoomHandler />
      <PaddleLighting />
      <PaddleLayout />
      <PaddleZoneIdentity />
      <PaddleZoneHotspots />
      <ContactShadows
        position={[0, 0.01, 0.2]}
        opacity={0.34}
        width={12}
        height={14}
        blur={2.2}
        far={3}
        color="#061018"
      />
      <AgentsLayer />
      {showPostProcessing && (
        <SceneErrorBoundary>
          <Suspense fallback={null}>
            <PaddlePostProcessing flags={qualityFlags} />
          </Suspense>
        </SceneErrorBoundary>
      )}
    </>
  );
}

export function PaddleScene() {
  const preset = useGraphicsStore((state) => state.preset);
  const qualityFlags = useMemo(() => presetToFlags(preset), [preset]);
  const showPostProcessing = isPostProcessingEnabled(preset);

  return (
    <Canvas
      orthographic
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false }}
      camera={{
        position: [11, 12.5, 11],
        near: -50,
        far: 200,
        zoom: 1,
      }}
      style={{ background: BG }}
      onPointerMissed={() => {
        document.body.style.cursor = 'default';
      }}
    >
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[PADDLE_PALETTE.fog, 26, 50]} />
      <SceneContents
        qualityFlags={qualityFlags}
        showPostProcessing={showPostProcessing}
      />
    </Canvas>
  );
}

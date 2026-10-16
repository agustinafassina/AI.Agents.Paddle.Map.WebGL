import { useMemo } from 'react';
import { resolveActivePaddleZone } from '@/config/resolveActivePaddleZone';
import type { PaddleZoneId } from '@/config/paddleZones';
import { useSceneStore } from '@/stores/scene.store';

export function useActivePaddleZone(): PaddleZoneId {
  const panOffset = useSceneStore((s) => s.panOffset);
  const zoomLevel = useSceneStore((s) => s.zoomLevel);
  const focusedZoneId = useSceneStore((s) => s.focusedZoneId);

  return useMemo(
    () => focusedZoneId ?? resolveActivePaddleZone(panOffset, zoomLevel),
    [focusedZoneId, panOffset, zoomLevel],
  );
}

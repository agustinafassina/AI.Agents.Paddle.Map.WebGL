import { useFrame } from '@react-three/fiber';
import { useAgentBootstrap } from '@/hooks/useBootstrap';
import { useAmbientAgentConversations } from '@/hooks/useAmbientAgentConversations';
import { useAgentsStore } from '@/stores/agents.store';
import { useChatStore } from '@/stores/chat.store';
import { useMatchStore } from '@/stores/match.store';

export function useAgentMovement() {
  useAgentBootstrap();
  useAmbientAgentConversations();
  const tick = useAgentsStore((state) => state.tick);

  useFrame(
    (_, delta) => {
      const paused = useChatStore.getState().isPanelOpen;
      useMatchStore.getState().tick(delta, paused);
      tick(delta);
    },
    -1,
  );
}
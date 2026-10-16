import { PaddleScene } from '@/components/scene/PaddleScene';
import { LazyChatPanel } from '@/components/ui/LazyChatPanel';
import { PaddleHud } from '@/components/ui/PaddleHud';
import { ScoreboardHud } from '@/components/ui/ScoreboardHud';
import { PeerConversationBanner } from '@/components/ui/PeerConversationBanner';
import { PaddleNavigation } from '@/components/ui/PaddleNavigation';
import { ZoomControls } from '@/components/ui/ZoomControls';
import { FollowAgentButton } from '@/components/ui/FollowAgentButton';
import { useBootstrap, useChatPanelPreload } from '@/hooks/useBootstrap';
import { useChatStore } from '@/stores/chat.store';
import './App.css';

export function App() {
  useBootstrap();
  useChatPanelPreload();
  const isChatOpen = useChatStore((state) => state.isPanelOpen);

  return (
    <div className={`app${isChatOpen ? ' app--chat-open' : ''}`}>
      <main className="app__viewport">
        <PaddleScene />
        <div className="app__vignette" aria-hidden />
        <PeerConversationBanner />
        <ScoreboardHud />
        <PaddleHud />
        <PaddleNavigation />
        <FollowAgentButton />
        <ZoomControls />
      </main>
      <LazyChatPanel />
    </div>
  );
}
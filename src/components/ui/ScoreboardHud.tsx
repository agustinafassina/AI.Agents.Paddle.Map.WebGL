import { useTranslation } from '@/i18n';
import { formatPointScore } from '@/config/courtLayout';
import { useMatchStore } from '@/stores/match.store';
import './ScoreboardHud.css';

export function ScoreboardHud() {
  const { t } = useTranslation();
  const pointsA = useMatchStore((state) => state.pointsA);
  const pointsB = useMatchStore((state) => state.pointsB);
  const gamesA = useMatchStore((state) => state.gamesA);
  const gamesB = useMatchStore((state) => state.gamesB);

  return (
    <div className="scoreboard" aria-label={t('scoreboard.aria')}>
      <span className="scoreboard__team">{t('scoreboard.near')}</span>
      <span className="scoreboard__games">{gamesA}</span>
      <span className="scoreboard__points">
        {formatPointScore(pointsA)}
        <span className="scoreboard__dash">–</span>
        {formatPointScore(pointsB)}
      </span>
      <span className="scoreboard__games">{gamesB}</span>
      <span className="scoreboard__team scoreboard__team--far">{t('scoreboard.far')}</span>
    </div>
  );
}

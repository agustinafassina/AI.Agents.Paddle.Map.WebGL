import { PADDLE_ZONE_LINKS } from '@/config/paddleZones';
import { NAV_ZONE_LABEL_KEYS } from '@/i18n/navZones';
import { useTranslation } from '@/i18n';
import { useSceneStore } from '@/stores/scene.store';
import { UiIcon } from './UiIcon';
import './PaddleNavigation.css';

export function PaddleNavigation() {
  const { t } = useTranslation();
  const focusedZoneId = useSceneStore((s) => s.focusedZoneId);
  const focusZone = useSceneStore((s) => s.focusZone);

  return (
    <nav className="paddle-nav" aria-label={t('nav.ariaLabel')}>
      {PADDLE_ZONE_LINKS.map((zone) => {
        const label = t(NAV_ZONE_LABEL_KEYS[zone.id]);
        const isActive = focusedZoneId === zone.id;

        return (
          <button
            key={zone.id}
            type="button"
            className={`paddle-nav__btn${isActive ? ' paddle-nav__btn--active' : ''}`}
            onClick={() => focusZone(zone.id)}
            aria-label={t('nav.focusZone', { label })}
            aria-current={isActive ? 'true' : undefined}
            title={t('nav.focusZone', { label })}
          >
            <span className="paddle-nav__icon" aria-hidden>
              <UiIcon name={zone.icon} size={16} />
            </span>
            <span className="paddle-nav__label">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

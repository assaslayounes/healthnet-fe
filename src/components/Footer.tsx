import { Link } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';
import { useI18n } from '@/i18n';
export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-12 border-t border-border bg-muted">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-2 font-extrabold text-primary"><HeartPulse className="h-5 w-5" />{t('brand')}</div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">{t('footerText')}</p>
        </div>
        <div>
          <h3 className="mb-3 font-bold">{t('links')}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/doctors">{t('doctors')}</Link></li><li><Link to="/pharmacies">{t('pharmacies')}</Link></li><li><Link to="/labs">{t('labs')}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">© 2026 DZ HealthNet — {t('rights')}</div>
    </footer>
  );
}

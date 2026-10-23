import { Link } from 'react-router-dom';
import { MapPin, Star, User } from 'lucide-react';
import { useI18n } from '@/i18n';
import type { Provider } from '@/lib/types';
export default function ProviderCard({ p }: { p: Provider }) {
  const { t, lang } = useI18n();
  const spec = lang === 'ar' ? p.name_ar : p.name_en;
  return (
    <Link to={`/providers/${p.id}`} className="flex gap-4 rounded-2xl border border-border bg-background p-4 transition hover:border-primary hover:shadow-md">
      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary"><User className="h-8 w-8" /></span>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-extrabold">{p.name}</h3>
        {spec && <p className="text-sm text-muted-foreground">{spec}</p>}
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {p.city && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{p.city}</span>}
          {p.distance_km != null && <span className="font-semibold text-primary">{Number(p.distance_km).toFixed(1)} {t('kmAway')}</span>}
          {p.rating_count > 0 && <span className="flex items-center gap-1 font-semibold text-foreground"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{Number(p.rating_avg).toFixed(1)} ({p.rating_count})</span>}
        </div>
        <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${p.is_available_today ? 'bg-primary-soft text-primary' : 'bg-muted text-muted-foreground'}`}>
          {t(p.is_available_today ? 'availableToday' : 'unavailableToday')}
        </span>
      </div>
    </Link>
  );
}

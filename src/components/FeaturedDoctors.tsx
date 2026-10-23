import { Link } from 'react-router-dom';
import { Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFeatured } from '@/lib/queries';
import { useI18n } from '@/i18n';
export default function FeaturedDoctors() {
  const { t, lang } = useI18n(); const { data, isLoading } = useFeatured();
  return (
    <section className="mx-auto mt-8 max-w-6xl px-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-extrabold">{t('featured')}</h2>
        <Link to="/doctors" className="text-sm font-semibold text-primary">{t('seeAll')}</Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-3 [scrollbar-width:none]">
        {isLoading && [0, 1, 2].map((i) => <div key={i} className="h-72 w-64 shrink-0 animate-pulse rounded-3xl bg-muted" />)}
        {data?.map((d) => (
          <article key={d.id} className="w-64 shrink-0 rounded-3xl border border-border bg-background p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-soft text-primary"><User className="h-10 w-10" /></span>
              {d.is_available_today ? <span className="flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary"><span className="h-2 w-2 rounded-full bg-primary" />{t('online')}</span> : null}
            </div>
            <h3 className="mt-4 truncate font-extrabold">{d.name}</h3>
            <p className="text-sm text-muted-foreground">{lang === 'ar' ? d.name_ar : d.name_en}</p>
            <p className="mt-2 flex items-center gap-1 text-sm font-bold"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{Number(d.rating_avg).toFixed(1)} <span className="font-normal text-muted-foreground">({d.rating_count})</span></p>
            <Button asChild className="mt-4 w-full rounded-full" size="lg"><Link to={`/providers/${d.id}`}>{t('book')}</Link></Button>
          </article>
        ))}
      </div>
    </section>
  );
}

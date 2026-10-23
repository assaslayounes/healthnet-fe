import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { LocateFixed, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProviderCard from '@/components/ProviderCard';
import { useProviders } from '@/lib/queries';
import { useDebounced, useGeolocate } from '@/lib/hooks';
import type { ProviderType } from '@/lib/types';
import { specialties } from '@/data';
import { useI18n, type Key } from '@/i18n';
const titles: Record<ProviderType, Key> = { doctor: 'doctors', dentist: 'dentist', pharmacy: 'pharmacies', lab: 'labs' };
export default function ProvidersList({ type }: { type: ProviderType }) {
  const { t, lang } = useI18n(); const { slug } = useParams(); const [q, setQ] = useState(''); const dq = useDebounced(q);
  const { pos, locate } = useGeolocate();
  const { data, isLoading } = useProviders({ type, specialty: slug, q: dq || undefined, ...pos });
  const s = specialties.find((x) => x.slug === slug);
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-extrabold">{s ? (lang === 'ar' ? s.ar : s.en) : t(titles[type])}</h1>
      <div className="my-5 flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-background px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('placeholder')} className="h-11 flex-1 bg-transparent text-sm outline-none" />
        </div>
        <Button variant={pos ? 'default' : 'outline'} className="rounded-full" onClick={() => locate()}><LocateFixed className="h-4 w-4" />{t('nearMe')}</Button>
      </div>
      {isLoading && <p className="py-12 text-center text-muted-foreground">{t('loading')}</p>}
      {data?.length === 0 && <p className="py-12 text-center text-muted-foreground">{t('noResults')}</p>}
      <div className="grid gap-3 md:grid-cols-2">{data?.map((p) => <ProviderCard key={p.id} p={p} />)}</div>
    </section>
  );
}

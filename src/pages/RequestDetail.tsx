import { useParams } from 'react-router-dom';
import { Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useApiMutation, useRequest } from '@/lib/queries';
import { useGeolocate } from '@/lib/hooks';
import { useI18n, type Key } from '@/i18n';
export default function RequestDetail() {
  const { id } = useParams(); const { t } = useI18n(); const { data: d } = useRequest(id); const { locate } = useGeolocate();
  const keys = [['req', id], ['reqs']];
  const accept = useApiMutation((pid: number) => api.post(`/requests/${id}/accept`, { providerId: pid }), keys);
  const close = useApiMutation(() => api.post(`/requests/${id}/close`), keys);
  const expand = useApiMutation((p: { lat: number; lng: number }) => api.post<{ added: number }>(`/requests/${id}/expand`, p), keys,
    (r) => toast.success(`${t('expandedN')}: ${(r as { data: { added: number } }).data.added}`));
  if (!d) return <p className="py-32 text-center text-muted-foreground">{t('loading')}</p>;
  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-extrabold">{d.title}</h1>
      <p className="mb-6 text-muted-foreground">{t(`req_${d.kind}` as Key)} · {t(`rs_${d.status}` as Key)}</p>
      <ul className="space-y-3">
        {d.targets.map((x) => (
          <li key={x.provider_id} className={`rounded-2xl border p-4 ${d.accepted_provider_id === x.provider_id ? 'border-primary bg-primary-soft' : 'border-border'}`}>
            <div className="flex items-center justify-between"><span className="font-extrabold">{x.name}</span>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold">{t(`resp_${x.response}` as Key)}</span></div>
            <p className="text-sm text-muted-foreground">{x.address}{x.distance_km != null && ` · ${Number(x.distance_km).toFixed(1)} ${t('kmAway')}`}</p>
            {x.note && <p className="mt-1 text-sm">{x.note}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              {x.phone && <Button asChild variant="outline" size="sm"><a href={`tel:${x.phone}`}><Phone className="h-4 w-4" />{x.phone}</a></Button>}
              {d.status === 'open' && (x.response === 'available' || x.response === 'partial') && <Button size="sm" onClick={() => accept.mutate(x.provider_id)}>{t('acceptThis')}</Button>}
            </div>
          </li>
        ))}
      </ul>
      {d.status !== 'closed' && (
        <div className="mt-6 flex gap-2">
          {d.status === 'open' && <Button variant="outline" onClick={() => locate((p) => expand.mutate(p))}>{t('expand')}</Button>}
          <Button variant="ghost" onClick={() => close.mutate(undefined)}>{t('closeReq')}</Button>
        </div>)}
    </section>
  );
}

import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRequests } from '@/lib/queries';
import { useI18n, type Key } from '@/i18n';
import { fmtDate } from '@/lib/format';
export default function Requests() {
  const { t, lang } = useI18n(); const { data } = useRequests();
  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between"><h1 className="text-2xl font-extrabold">{t('requests')}</h1>
        <Button asChild><Link to="/requests/new"><Plus className="h-4 w-4" />{t('newRequest')}</Link></Button></div>
      {data?.length === 0 && <p className="py-12 text-center text-muted-foreground">{t('noRequests')}</p>}
      <ul className="space-y-3">
        {data?.map((r) => (
          <li key={r.id}><Link to={`/requests/${r.id}`} className="block rounded-2xl border border-border p-4 hover:border-primary">
            <div className="flex items-center justify-between"><span className="font-extrabold">{r.title}</span>
              <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-bold text-primary">{t(`rs_${r.status}` as Key)}</span></div>
            <p className="text-sm text-muted-foreground">{t(`req_${r.kind}` as Key)} · {fmtDate(r.created_at, lang)}</p>
            <p className="mt-1 text-sm">{r.accepted_provider_name ?? `${r.responded}/${r.targets}`}</p>
          </Link></li>
        ))}
      </ul>
    </section>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { useApiMutation, useIncoming } from '@/lib/queries';
import { useI18n, type Key } from '@/i18n';
import { fmtDate } from '@/lib/format';
export default function Dashboard() {
  const { t, lang } = useI18n(); const nav = useNavigate(); const { data } = useIncoming(); const [token, setToken] = useState('');
  const patch = useApiMutation((v: { id: number; body: Record<string, string> }) => api.patch(`/appointments/${v.id}`, v.body), [['incoming']]);
  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-extrabold">{t('dashboard')}</h1>
      <div className="mb-8 flex gap-2"><Input dir="ltr" placeholder={t('enterToken')} value={token} onChange={(e) => setToken(e.target.value.trim())} />
        <Button disabled={token.length !== 32} onClick={() => nav(`/share/${token}`)}>{t('open')}</Button></div>
      <h2 className="mb-3 font-extrabold">{t('incoming')}</h2>
      {data?.length === 0 && <p className="py-8 text-center text-muted-foreground">{t('noItems')}</p>}
      <ul className="space-y-3">
        {data?.map((a) => {
          const open = a.status === 'pending' || a.status === 'confirmed';
          return (
            <li key={a.id} className="rounded-2xl border border-border p-4">
              <div className="flex items-center justify-between"><span className="font-extrabold">{a.patient_name}</span>
                <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-bold text-primary">{t(`st_${a.status}` as Key)}</span></div>
              <p className="text-sm text-muted-foreground">{fmtDate(a.scheduled_at, lang)}</p>
              {open && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <select value={a.priority} onChange={(e) => patch.mutate({ id: a.id, body: { priority: e.target.value } })} aria-label={t('priority')} className="h-9 rounded-lg border border-border bg-background px-2 text-sm">
                    {['normal', 'urgent', 'critical'].map((p) => <option key={p} value={p}>{t(`prio_${p}` as Key)}</option>)}</select>
                  {a.status === 'pending' && <Button size="sm" onClick={() => patch.mutate({ id: a.id, body: { status: 'confirmed' } })}>{t('act_confirm')}</Button>}
                  <Button size="sm" variant="outline" onClick={() => patch.mutate({ id: a.id, body: { status: 'done' } })}>{t('act_done')}</Button>
                  <Button size="sm" variant="ghost" onClick={() => patch.mutate({ id: a.id, body: { status: 'cancelled' } })}>{t('act_cancel')}</Button>
                </div>)}
            </li>);
        })}
      </ul>
    </section>
  );
}

import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LocateFixed } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useApiMutation, useDocs } from '@/lib/queries';
import { useGeolocate } from '@/lib/hooks';
import { useI18n, type Key } from '@/i18n';
export default function NewRequest() {
  const { t } = useI18n(); const nav = useNavigate(); const [sp] = useSearchParams(); const { data: docs = [] } = useDocs(); const { pos, locate } = useGeolocate();
  const [docId, setDocId] = useState(Number(sp.get('doc')) || 0);
  const [kind, setKind] = useState<'prescription' | 'lab'>(sp.get('kind') === 'lab' ? 'lab' : 'prescription');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const send = useApiMutation(() => api.post<{ id: number }>('/requests', { kind, documentId: docId, priority, ...pos }), [['reqs']],
    (r) => { toast.success(t('requestSent')); nav(`/requests/${(r as { data: { id: number } }).data.id}`); });
  const seg = <T extends string>(v: T, cur: T, set: (x: T) => void, k: Key) => (
    <button type="button" onClick={() => set(v)} className={`flex-1 rounded-lg border px-3 py-2 text-sm font-bold ${cur === v ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>{t(k)}</button>);
  return (
    <section className="mx-auto max-w-md space-y-5 px-4 py-8">
      <h1 className="text-2xl font-extrabold">{t('newRequest')}</h1>
      <div className="flex gap-2">{seg('prescription', kind, setKind, 'req_prescription')}{seg('lab', kind, setKind, 'req_lab')}</div>
      <select value={docId} onChange={(e) => setDocId(Number(e.target.value))} className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm">
        <option value={0}>{t('chooseDocument')}</option>{docs.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}
      </select>
      <div><p className="mb-2 text-sm font-semibold">{t('priority')}</p><div className="flex gap-2">{seg('normal', priority, setPriority, 'prio_normal')}{seg('urgent', priority, setPriority, 'prio_urgent')}</div></div>
      <Button variant={pos ? 'default' : 'outline'} className="w-full" onClick={() => locate()}><LocateFixed className="h-4 w-4" />{pos ? t('locationSet') : t('useLocation')}</Button>
      <Button size="lg" className="w-full" onClick={() => send.mutate(undefined)} disabled={send.isPending || !docId || !pos}>{t('sendRequest')}</Button>
    </section>
  );
}

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api, fileUrl } from '@/lib/api';
import { useApiMutation, useInboxItem } from '@/lib/queries';
import { useI18n, type Key } from '@/i18n';
export default function InboxDetail() {
  const { id } = useParams(); const { t } = useI18n(); const { data: d } = useInboxItem(id); const [note, setNote] = useState('');
  const respond = useApiMutation((response: string) => api.post(`/requests/${id}/respond`, { response, note: note || undefined }), [['inboxItem', id], ['inbox']]);
  if (!d) return <p className="py-32 text-center text-muted-foreground">{t('loading')}</p>;
  return (
    <section className="mx-auto max-w-md space-y-4 px-4 py-8">
      <h1 className="text-2xl font-extrabold">{d.title}</h1>
      <p className="text-muted-foreground">{t('patientName')}: {d.patient_name} · {t(`rs_${d.status}` as Key)} · {t(`resp_${d.response}` as Key)}</p>
      <Button asChild variant="outline" className="w-full"><a href={fileUrl(d.url)} target="_blank" rel="noreferrer">{t('openDoc')}</a></Button>
      <Input placeholder={t('note')} value={note} onChange={(e) => setNote(e.target.value)} />
      <div className="grid grid-cols-3 gap-2">
        {(['available', 'partial', 'unavailable'] as const).map((r) => <Button key={r} variant={r === 'available' ? 'default' : 'outline'} disabled={respond.isPending} onClick={() => respond.mutate(r)}>{t(`resp_${r}` as Key)}</Button>)}
      </div>
    </section>
  );
}

import { useState } from 'react';
import { BellRing, Check, Plus, Trash2, Undo2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { useApiMutation, useConditions, useMeds, useSchedule } from '@/lib/queries';
import { localDate } from '@/lib/hooks';
import { useI18n, type Key } from '@/i18n';
const CODES = ['diabetes', 'hypertension', 'asthma', 'heart_disease', 'kidney_disease', 'thyroid', 'epilepsy', 'arthritis', 'other'];
export default function Health() {
  const { t } = useI18n(); const date = localDate();
  const conds = useConditions(); const meds = useMeds(); const sched = useSchedule(date);
  const [name, setName] = useState(''); const [dose, setDose] = useState(''); const [times, setTimes] = useState<string[]>(['08:00']);
  const [perm, setPerm] = useState('Notification' in window ? Notification.permission : 'denied');
  const saveConds = useApiMutation((c: string[]) => api.put('/health/conditions', { conditions: c }), [['conditions']]);
  const addMed = useApiMutation(() => api.post('/medications', { name: name.trim(), dose: dose.trim() || undefined, times }), [['meds'], ['sched']], () => { setName(''); setDose(''); setTimes(['08:00']); });
  const delMed = useApiMutation((id: number) => api.delete(`/medications/${id}`), [['meds'], ['sched']]);
  const mark = useApiMutation((v: { id: number; time: string; undo: boolean }) => v.undo
    ? api.delete(`/medications/${v.id}/taken`, { params: { date, time: v.time } }) : api.post(`/medications/${v.id}/taken`, { date, time: v.time }), [['sched']]);
  const toggle = (c: string) => { const cur = conds.data ?? []; saveConds.mutate(cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]); };
  const enable = async () => setPerm(await Notification.requestPermission());
  return (
    <section className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      <div><h1 className="text-2xl font-extrabold">{t('health')}</h1><p className="text-muted-foreground">{t('healthIntro')}</p></div>
      <div>
        <h2 className="mb-3 font-extrabold">{t('conditions')}</h2>
        <div className="flex flex-wrap gap-2">{CODES.map((c) => {
          const on = conds.data?.includes(c);
          return <button key={c} type="button" onClick={() => toggle(c)} className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${on ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>{t(`cond_${c}` as Key)}</button>;
        })}</div>
      </div>
      <div>
        <div className="mb-3 flex items-center justify-between"><h2 className="font-extrabold">{t('todaySchedule')}</h2>
          {'Notification' in window && (perm === 'granted' ? <span className="flex items-center gap-1 text-xs font-bold text-primary"><BellRing className="h-4 w-4" />{t('remindersOn')}</span>
            : <Button size="sm" variant="outline" onClick={enable}><BellRing className="h-4 w-4" />{t('enableReminders')}</Button>)}</div>
        <p className="mb-3 text-xs text-muted-foreground">{t('remindersNote')}</p>
        {sched.data?.length === 0 && <p className="text-muted-foreground">{t('noMeds')}</p>}
        <ul className="space-y-2">
          {sched.data?.map((d) => (
            <li key={`${d.medicationId}-${d.time}`} className={`flex items-center justify-between rounded-xl border p-3 ${d.taken ? 'border-primary bg-primary-soft' : 'border-border'}`}>
              <div><p className="font-bold">{d.name}{d.dose && <span className="font-normal text-muted-foreground"> · {d.dose}</span>}</p><p className="text-sm text-muted-foreground" dir="ltr">{d.time}</p></div>
              <Button size="sm" variant={d.taken ? 'outline' : 'default'} onClick={() => mark.mutate({ id: d.medicationId, time: d.time, undo: d.taken })}>
                {d.taken ? <><Undo2 className="h-4 w-4" />{t('undo')}</> : <><Check className="h-4 w-4" />{t('taken')}</>}</Button>
            </li>))}
        </ul>
      </div>
      <div className="space-y-3 rounded-2xl bg-primary-soft p-5">
        <h2 className="font-extrabold">{t('addMed')}</h2>
        <Input placeholder={t('medName')} value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder={t('dose')} value={dose} onChange={(e) => setDose(e.target.value)} />
        <div className="flex flex-wrap gap-2">
          {times.map((tm, i) => (
            <span key={i} className="flex items-center gap-1 rounded-lg bg-background p-1">
              <input type="time" value={tm} onChange={(e) => setTimes(times.map((x, j) => (j === i ? e.target.value : x)))} className="h-9 rounded border border-border px-2 text-sm" dir="ltr" />
              {times.length > 1 && <button type="button" onClick={() => setTimes(times.filter((_, j) => j !== i))} aria-label="remove"><X className="h-4 w-4" /></button>}
            </span>))}
          {times.length < 6 && <Button size="sm" variant="outline" onClick={() => setTimes([...times, '12:00'])}><Plus className="h-4 w-4" />{t('addTime')}</Button>}
        </div>
        <Button onClick={() => addMed.mutate(undefined)} disabled={name.trim().length < 2 || times.some((x) => !x) || addMed.isPending}>{t('addMed')}</Button>
      </div>
      <div>
        <h2 className="mb-3 font-extrabold">{t('myMeds')}</h2>
        {meds.data?.length === 0 && <p className="text-muted-foreground">{t('noMeds')}</p>}
        <ul className="space-y-2">{meds.data?.map((m) => (
          <li key={m.id} className="flex items-center justify-between rounded-xl border border-border p-3">
            <div><p className="font-bold">{m.name}{m.dose && <span className="font-normal text-muted-foreground"> · {m.dose}</span>}</p><p className="text-sm text-muted-foreground" dir="ltr">{m.times.join(' · ')}</p></div>
            <Button size="sm" variant="ghost" onClick={() => delMed.mutate(m.id)} aria-label={t('remove')}><Trash2 className="h-4 w-4" /></Button>
          </li>))}</ul>
      </div>
    </section>
  );
}

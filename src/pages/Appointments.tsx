import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useApiMutation, useMyAppointments } from '@/lib/queries';
import { useI18n, type Key } from '@/i18n';
import { fmtDate } from '@/lib/format';
export default function Appointments() {
  const { t, lang } = useI18n(); const { data, isLoading } = useMyAppointments();
  const cancel = useApiMutation((id: number) => api.post(`/appointments/${id}/cancel`), [['appts']], () => toast.success(t('cancelled')));
  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-extrabold">{t('appointments')}</h1>
      {isLoading && <p className="text-muted-foreground">{t('loading')}</p>}
      {data?.length === 0 && <p className="py-12 text-center text-muted-foreground">{t('noAppointments')}</p>}
      <ul className="space-y-3">
        {data?.map((a) => (
          <li key={a.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border p-4">
            <div>
              <Link to={`/providers/${a.provider_id}`} className="font-extrabold hover:text-primary">{a.provider_name}</Link>
              <p className="text-sm text-muted-foreground">{fmtDate(a.scheduled_at, lang)}</p>
              <span className="mt-1 inline-block rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-bold text-primary">{t(`st_${a.status}` as Key)}</span>
            </div>
            {(a.status === 'pending' || a.status === 'confirmed') && <Button variant="outline" disabled={cancel.isPending} onClick={() => cancel.mutate(a.id)}>{t('cancelAppt')}</Button>}
          </li>
        ))}
      </ul>
    </section>
  );
}

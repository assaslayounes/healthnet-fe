import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useApiMutation, useNotices } from '@/lib/queries';
import { useI18n } from '@/i18n';
import { fmtDate } from '@/lib/format';
export default function Notifications() {
  const { t, lang } = useI18n(); const { data } = useNotices();
  const readAll = useApiMutation(() => api.post('/notifications/read', {}), [['notices']]);
  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between"><h1 className="text-2xl font-extrabold">{t('notifications')}</h1>
        <Button variant="outline" onClick={() => readAll.mutate(undefined)}>{t('markAllRead')}</Button></div>
      {data?.length === 0 && <p className="py-12 text-center text-muted-foreground">{t('noNotifications')}</p>}
      <ul className="space-y-2">
        {data?.map((n) => (
          <li key={n.id} className={`rounded-xl border p-4 ${n.is_read ? 'border-border' : 'border-primary bg-primary-soft'}`}>
            <p className="font-bold">{n.title}</p>{n.body && <p className="text-sm text-muted-foreground">{n.body}</p>}
            <p className="mt-1 text-xs text-muted-foreground">{fmtDate(n.created_at, lang)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

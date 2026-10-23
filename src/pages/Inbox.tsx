import { Link } from 'react-router-dom';
import { useInbox } from '@/lib/queries';
import { useI18n, type Key } from '@/i18n';
import { fmtDate } from '@/lib/format';
export default function Inbox() {
  const { t, lang } = useI18n(); const { data } = useInbox();
  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-extrabold">{t('inbox')}</h1>
      {data?.length === 0 && <p className="py-12 text-center text-muted-foreground">{t('noItems')}</p>}
      <ul className="space-y-3">
        {data?.map((i) => (
          <li key={i.request_id}><Link to={`/inbox/${i.request_id}`} className={`block rounded-2xl border p-4 hover:border-primary ${i.closed_for_me ? 'opacity-50' : ''} ${i.priority === 'urgent' ? 'border-amber-400' : 'border-border'}`}>
            <div className="flex items-center justify-between"><span className="font-extrabold">{i.title}</span>
              {i.priority !== 'normal' && <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">{t(`prio_${i.priority}` as Key)}</span>}</div>
            <p className="text-sm text-muted-foreground">{i.patient_name} · {fmtDate(i.created_at, lang)}</p>
            <p className="mt-1 text-xs font-bold text-primary">{i.closed_for_me ? t('closedForMe') : t(`resp_${i.response}` as Key)}</p>
          </Link></li>
        ))}
      </ul>
    </section>
  );
}

import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/auth';
import { useI18n } from '@/i18n';
import { useSchedule } from '@/lib/queries';
import { localDate } from '@/lib/hooks';
const mins = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3));
/** يفحص الجرعات كل 30 ثانية وينبّه لما حان وقته خلال آخر ساعتين ولم يُؤخذ */
export default function Reminders() {
  const { user } = useAuth(); const { t } = useI18n(); const date = localDate();
  const { data } = useSchedule(date, user?.role === 'patient');
  useEffect(() => {
    if (!data?.length) return;
    const tick = () => {
      const fired = new Set<string>(JSON.parse(sessionStorage.getItem('fired') ?? '[]'));
      const now = new Date(); const nowMin = now.getHours() * 60 + now.getMinutes();
      for (const d of data) {
        const key = `${date}-${d.medicationId}-${d.time}`; const diff = nowMin - mins(d.time);
        if (d.taken || diff < 0 || diff > 120 || fired.has(key)) continue;
        fired.add(key); sessionStorage.setItem('fired', JSON.stringify([...fired]));
        const msg = `${t('remindNow')}: ${d.name}${d.dose ? ` (${d.dose})` : ''}`;
        toast(msg, { duration: 20_000, icon: '💊' });
        if ('Notification' in window && Notification.permission === 'granted') new Notification('DZ HealthNet', { body: msg });
      }
    };
    tick(); const h = setInterval(tick, 30_000); return () => clearInterval(h);
  }, [data, date, t]);
  return null;
}

import { Link } from 'react-router-dom';
import { Stethoscope, Smile, Pill, FlaskConical, ScanFace, Baby, HeartPulse } from 'lucide-react';
import { useI18n } from '@/i18n';
export default function Categories() {
  const { t } = useI18n();
  const cats = [
    { to: '/doctors/general', icon: Stethoscope, label: t('general') },
    { to: '/dentists', icon: Smile, label: t('dentist') },
    { to: '/pharmacies', icon: Pill, label: t('pharmacy') },
    { to: '/labs', icon: FlaskConical, label: t('lab') },
    { to: '/doctors/dermatology', icon: ScanFace, label: t('dermatology') },
    { to: '/doctors/pediatrics', icon: Baby, label: t('pediatrics') },
    { to: '/doctors/cardiology', icon: HeartPulse, label: t('cardiology') },
  ];
  return (
    <section className="mx-auto mt-6 max-w-6xl px-4">
      <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none]">
        {cats.map(({ to, icon: Icon, label }, i) => (
          <Link key={to} to={to} className="flex w-20 shrink-0 flex-col items-center gap-2 text-center">
            <span className={`flex h-16 w-16 items-center justify-center rounded-2xl ${i === 0 ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-primary'}`}><Icon className="h-7 w-7" /></span>
            <span className="text-xs font-semibold leading-tight">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

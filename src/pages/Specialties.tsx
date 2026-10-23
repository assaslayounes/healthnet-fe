import { Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import { specialties } from '@/data';
import { useI18n } from '@/i18n';
export default function Specialties() {
  const { t, lang } = useI18n();
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-extrabold">{t('specTitle')}</h1>
      <p className="mb-8 mt-2 text-muted-foreground">{t('specSub')}</p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {specialties.map((s) => (
          <Link key={s.slug} to={`/doctors/${s.slug}`} className="flex items-center gap-3 rounded-lg border border-border p-4 hover:border-primary hover:bg-primary-soft">
            <Stethoscope className="h-5 w-5 shrink-0 text-primary" /><span className="font-semibold">{lang === 'ar' ? s.ar : s.en}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

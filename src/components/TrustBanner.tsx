import { ShieldCheck, ChevronRight } from 'lucide-react';
import { useI18n } from '@/i18n';
export default function TrustBanner() {
  const { t, lang } = useI18n();
  return (
    <section className="mx-auto mt-6 max-w-6xl px-4">
      <div className="flex items-center gap-4 rounded-3xl bg-primary-soft p-5">
        <ShieldCheck className="h-12 w-12 shrink-0 text-primary" strokeWidth={1.5} />
        <div className="flex-1"><h3 className="font-extrabold">{t('trustedTitle')}</h3><p className="text-sm text-muted-foreground">{t('trustedSub')}</p></div>
        <ChevronRight className={`h-5 w-5 text-muted-foreground ${lang === 'ar' ? 'rotate-180' : ''}`} />
      </div>
    </section>
  );
}

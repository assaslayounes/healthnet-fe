import { SlidersHorizontal, Search, Stethoscope } from 'lucide-react';
import { useI18n } from '@/i18n';
export default function Hero() {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-soft via-primary-soft to-white p-6 pb-24 md:p-12 md:pb-28">
        <div className="pointer-events-none absolute -end-10 -top-10 h-56 w-56 rounded-full bg-primary/15" />
        <Stethoscope className="pointer-events-none absolute end-6 top-6 h-28 w-28 text-primary/40 md:h-44 md:w-44" strokeWidth={1.2} />
        <div className="relative max-w-md">
          <h1 className="text-3xl font-extrabold leading-snug md:text-5xl">{t('heroTitle')}</h1>
          <p className="mt-3 text-muted-foreground">{t('heroSub')}</p>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="absolute inset-x-4 bottom-5 flex items-center gap-2 rounded-full bg-background p-2 ps-5 shadow-lg md:inset-x-12">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" placeholder={t('placeholder')} />
          <button type="submit" aria-label="filters" className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground"><SlidersHorizontal className="h-5 w-5" /></button>
        </form>
      </div>
    </section>
  );
}

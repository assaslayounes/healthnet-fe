import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, Phone, Star, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { useApiMutation, useProvider, useReviews } from '@/lib/queries';
import { useAuth } from '@/auth';
import { useI18n } from '@/i18n';
import { fmtDate } from '@/lib/format';
export default function ProviderDetail() {
  const { id } = useParams(); const { t, lang } = useI18n(); const { user } = useAuth();
  const { data: p, isLoading, isError } = useProvider(id); const { data: reviews = [] } = useReviews(id);
  const [when, setWhen] = useState(''); const [rate, setRate] = useState(5); const [comment, setComment] = useState('');
  const book = useApiMutation(() => api.post('/appointments', { providerId: Number(id), scheduledAt: new Date(when).toISOString() }), [['appts']], () => { toast.success(t('booked')); setWhen(''); });
  const review = useApiMutation(() => api.post(`/providers/${id}/reviews`, { rating: rate, comment: comment || undefined }), [['reviews', id], ['provider', id], ['featured']], () => { toast.success(t('reviewSaved')); setComment(''); });
  if (isError) return <p className="py-32 text-center text-muted-foreground">{t('noResults')}</p>;
  if (isLoading || !p) return <p className="py-32 text-center text-muted-foreground">{t('loading')}</p>;
  const spec = lang === 'ar' ? p.name_ar : p.name_en;
  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center gap-4">
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-soft text-primary"><User className="h-12 w-12" /></span>
        <div>
          <h1 className="text-2xl font-extrabold">{p.name}</h1>
          {spec && <p className="text-muted-foreground">{spec}</p>}
          {p.rating_count > 0 && <p className="mt-1 flex items-center gap-1 font-bold"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{Number(p.rating_avg).toFixed(1)} <span className="font-normal text-muted-foreground">({p.rating_count})</span></p>}
        </div>
      </div>
      <ul className="mt-6 space-y-2 text-sm">
        {(p.address || p.city) && <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{[p.address, p.city].filter(Boolean).join('، ')}</li>}
        {p.phone && <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /><a href={`tel:${p.phone}`} dir="ltr">{p.phone}</a></li>}
        {p.consultation_price != null && <li className="font-semibold">{t('consultation')}: {p.consultation_price} {t('da')}</li>}
      </ul>
      {p.bio && <p className="mt-4 text-muted-foreground">{p.bio}</p>}
      {p.type !== 'pharmacy' && (
        <div className="mt-8 rounded-2xl bg-primary-soft p-5">
          <h2 className="mb-3 font-extrabold">{t('chooseTime')}</h2>
          {user?.role === 'patient' ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input type="datetime-local" value={when} min={new Date(Date.now() + 3600_000).toISOString().slice(0, 16)} onChange={(e) => setWhen(e.target.value)} />
              <Button size="lg" onClick={() => book.mutate(undefined)} disabled={!when || book.isPending}>{t('confirmBooking')}</Button>
            </div>
          ) : !user ? <Button asChild size="lg"><Link to="/login" state={{ from: `/providers/${p.id}` }}>{t('loginToBook')}</Link></Button> : null}
        </div>
      )}
      <h2 className="mb-3 mt-10 text-xl font-extrabold">{t('reviews')}</h2>
      {user?.role === 'patient' && (
        <div className="mb-5 space-y-2 rounded-2xl border border-border p-4">
          <p className="text-sm font-bold">{t('writeReview')}</p>
          <div className="flex gap-1" role="radiogroup" aria-label={t('rating')}>
            {[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" onClick={() => setRate(n)} aria-label={String(n)}><Star className={`h-7 w-7 ${n <= rate ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} /></button>)}
          </div>
          <Input placeholder={t('comment')} value={comment} onChange={(e) => setComment(e.target.value)} />
          <Button size="sm" onClick={() => review.mutate(undefined)} disabled={review.isPending}>{t('sendReview')}</Button>
        </div>
      )}
      {reviews.length === 0 && <p className="text-muted-foreground">{t('noReviews')}</p>}
      <ul className="space-y-3">
        {reviews.map((r) => (
          <li key={r.id} className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between"><span className="font-bold">{r.patient_first_name}</span>
              <span className="flex items-center gap-1 text-sm font-bold"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{r.rating}</span></div>
            {r.comment && <p className="mt-1 text-sm">{r.comment}</p>}
            <p className="mt-1 text-xs text-muted-foreground">{fmtDate(r.created_at, lang)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

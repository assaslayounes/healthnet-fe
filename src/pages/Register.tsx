import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input, Field } from '@/components/ui/input';
import { useAuth } from '@/auth';
import { useI18n, type Key } from '@/i18n';
import { errKey } from '@/lib/api';
import { specialties } from '@/data';
import { useGeolocate } from '@/lib/hooks';
import { LocateFixed } from 'lucide-react';
const schema = z.object({
  role: z.enum(['patient', 'doctor', 'dentist', 'pharmacy', 'lab']),
  fullName: z.string().min(3, 'errRequired'), email: z.string().email('errEmail'), phone: z.string().optional(),
  password: z.string().min(8, 'errPwShort'),
  providerName: z.string().optional(), wilaya: z.string().optional(), city: z.string().optional(), address: z.string().optional(), specialtySlug: z.string().optional(),
}).superRefine((d, ctx) => {
  if (d.role === 'patient') return;
  if (!d.providerName) ctx.addIssue({ code: 'custom', path: ['providerName'], message: 'errRequired' });
  if (!d.wilaya) ctx.addIssue({ code: 'custom', path: ['wilaya'], message: 'errRequired' });
  if (d.role === 'doctor' && !d.specialtySlug) ctx.addIssue({ code: 'custom', path: ['specialtySlug'], message: 'errRequired' });
});
type F = z.infer<typeof schema>;
export default function Register() {
  const { t, lang } = useI18n(); const { register: signUp } = useAuth(); const nav = useNavigate();
  const [isProvider, setIsProvider] = useState(false); const { pos, locate } = useGeolocate();
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<F>({ resolver: zodResolver(schema), defaultValues: { role: 'patient' } });
  const role = watch('role');
  const err = (m?: string) => (m ? t(m as Key) : undefined);
  const onSubmit = async (d: F) => {
    const body: Record<string, unknown> = { fullName: d.fullName, email: d.email, password: d.password, role: d.role, ...(d.phone ? { phone: d.phone } : {}) };
    if (d.role !== 'patient') body.provider = { name: d.providerName, wilaya: d.wilaya, city: d.city || undefined, address: d.address || undefined, specialtySlug: d.specialtySlug || undefined, ...(pos ?? {}) };
    try { await signUp(body); nav('/', { replace: true }); } catch (e) { toast.error(t(errKey(e))); }
  };
  const roles: { v: F['role']; k: Key }[] = [{ v: 'doctor', k: 'roleDoctor' }, { v: 'dentist', k: 'dentist' }, { v: 'pharmacy', k: 'pharmacy' }, { v: 'lab', k: 'lab' }];
  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-6 text-3xl font-extrabold">{t('register')}</h1>
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
        {[false, true].map((p) => (
          <button key={String(p)} type="button" onClick={() => { setIsProvider(p); setValue('role', p ? 'doctor' : 'patient'); }}
            className={`rounded-md py-2 text-sm font-bold ${isProvider === p ? 'bg-background shadow' : 'text-muted-foreground'}`}>{t(p ? 'iAmProvider' : 'iAmPatient')}</button>
        ))}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {isProvider && (
          <div className="flex flex-wrap gap-2">
            {roles.map((r) => (
              <button key={r.v} type="button" onClick={() => setValue('role', r.v)}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${role === r.v ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>{t(r.k)}</button>
            ))}
          </div>
        )}
        <Field label={t('fullName')} error={err(errors.fullName?.message)}><Input {...register('fullName')} /></Field>
        <Field label={t('email')} error={err(errors.email?.message)}><Input type="email" {...register('email')} /></Field>
        <Field label={t('phone')}><Input type="tel" {...register('phone')} /></Field>
        <Field label={t('password')} error={err(errors.password?.message)}><Input type="password" autoComplete="new-password" {...register('password')} /></Field>
        {isProvider && (<>
          <Field label={t('providerName')} error={err(errors.providerName?.message)}><Input {...register('providerName')} /></Field>
          {role === 'doctor' && (
            <Field label={t('specialty')} error={err(errors.specialtySlug?.message)}>
              <select className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm" {...register('specialtySlug')}>
                <option value="" />{specialties.map((s) => <option key={s.slug} value={s.slug}>{lang === 'ar' ? s.ar : s.en}</option>)}
              </select>
            </Field>)}
          <Field label={t('wilaya')} error={err(errors.wilaya?.message)}><Input {...register('wilaya')} /></Field>
          <Field label={t('city')}><Input {...register('city')} /></Field>
          <Field label={t('address')}><Input {...register('address')} /></Field>
          <Button type="button" variant={pos ? 'default' : 'outline'} className="w-full" onClick={() => locate()}><LocateFixed className="h-4 w-4" />{pos ? t('locationSet') : t('useLocation')}</Button>
        </>)}
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>{t('register')}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">{t('haveAccount')} <Link to="/login" className="font-bold text-primary">{t('login')}</Link></p>
    </section>
  );
}

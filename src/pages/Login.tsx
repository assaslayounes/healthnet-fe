import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input, Field } from '@/components/ui/input';
import { useAuth } from '@/auth';
import { useI18n, type Key } from '@/i18n';
import { errKey } from '@/lib/api';
const schema = z.object({ email: z.string().email('errEmail'), password: z.string().min(1, 'errRequired') });
type F = z.infer<typeof schema>;
export default function Login() {
  const { t } = useI18n(); const { login } = useAuth(); const nav = useNavigate(); const loc = useLocation();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<F>({ resolver: zodResolver(schema) });
  const onSubmit = async (d: F) => {
    try { await login(d.email, d.password); nav((loc.state as { from?: string } | null)?.from ?? '/', { replace: true }); }
    catch (e) { toast.error(t(errKey(e))); }
  };
  const err = (m?: string) => (m ? t(m as Key) : undefined);
  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-6 text-3xl font-extrabold">{t('login')}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label={t('email')} error={err(errors.email?.message)}><Input type="email" autoComplete="email" {...register('email')} /></Field>
        <Field label={t('password')} error={err(errors.password?.message)}><Input type="password" autoComplete="current-password" {...register('password')} /></Field>
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>{t('login')}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">{t('noAccount')} <Link to="/register" className="font-bold text-primary">{t('register')}</Link></p>
    </section>
  );
}

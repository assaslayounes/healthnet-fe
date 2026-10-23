import { Link, useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/auth';
import { useI18n } from '@/i18n';
export default function Profile() {
  const { t, lang, setLang } = useI18n(); const { user, logout } = useAuth(); const nav = useNavigate();
  if (!user) return (
    <section className="mx-auto max-w-md px-4 py-16 text-center">
      <Button asChild size="lg" className="w-full"><Link to="/login">{t('login')}</Link></Button>
      <Button asChild variant="outline" size="lg" className="mt-3 w-full"><Link to="/register">{t('register')}</Link></Button>
    </section>);
  return (
    <section className="mx-auto max-w-md px-4 py-12 text-center">
      <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary-soft text-primary"><User className="h-12 w-12" /></span>
      <h1 className="mt-4 text-2xl font-extrabold">{user.full_name}</h1>
      <p className="text-muted-foreground" dir="ltr">{user.email}</p>
      {user.role === 'patient' && <Button asChild variant="outline" className="mt-6 w-full"><Link to="/health">{t('health')}</Link></Button>}
      <Button variant="outline" className="mt-3 w-full" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}>{lang === 'ar' ? 'English' : 'العربية'}</Button>
      <Button className="mt-3 w-full" onClick={() => { logout(); nav('/'); }}>{t('logout')}</Button>
    </section>
  );
}

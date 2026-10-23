import { Link, NavLink } from 'react-router-dom';
import { HeartPulse, Bell, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n';
import { useAuth } from '@/auth';
import { useUnread } from '@/lib/queries';
import { useNav } from './useNav';
export default function Navbar() {
  const { t, lang, setLang } = useI18n(); const { user } = useAuth(); const unread = useUnread().data ?? 0;
  const items = useNav().filter((i) => i.to !== '/profile');
  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><HeartPulse className="h-6 w-6" /></span>
          <span className="leading-tight"><span className="block text-xl font-extrabold">Health<span className="text-primary">Net</span></span>
            <span className="block text-xs text-muted-foreground">{t('tagline')}</span></span>
        </Link>
        <nav className="hidden gap-6 md:flex">
          {items.map(({ to, label }) => (
            <NavLink key={to} to={to} end className={({ isActive }) => `text-sm font-semibold ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>{label}</NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} aria-label="language"><Languages className="h-5 w-5" /></Button>
          {user && (
            <Button asChild variant="ghost" size="icon" className="relative" aria-label="notifications">
              <Link to="/notifications"><Bell className="h-6 w-6" />{unread > 0 && <span className="absolute end-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />}</Link>
            </Button>)}
          <Button asChild className="hidden md:inline-flex">{user ? <Link to="/profile">{user.full_name.split(' ')[0]}</Link> : <Link to="/login">{t('login')}</Link>}</Button>
        </div>
      </div>
    </header>
  );
}

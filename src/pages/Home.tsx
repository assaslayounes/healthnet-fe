import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import FeaturedDoctors from '@/components/FeaturedDoctors';
import TrustBanner from '@/components/TrustBanner';
import { Link } from 'react-router-dom';
import { Send, Pill } from 'lucide-react';
import { useAuth } from '@/auth';
import { useI18n } from '@/i18n';
export default function Home() {
  const { t } = useI18n(); const { user } = useAuth();
  return (<><Hero /><Categories />
    <section className="mx-auto mt-6 max-w-6xl px-4"><Link to="/requests/new" className="flex items-center gap-4 rounded-3xl bg-primary p-5 text-primary-foreground">
      <Send className="h-9 w-9 shrink-0" /><span className="font-extrabold">{t('sendToProvider')}</span></Link></section>
    {user?.role === 'patient' && <section className="mx-auto mt-3 max-w-6xl px-4"><Link to="/health" className="flex items-center gap-4 rounded-3xl bg-primary-soft p-5">
      <Pill className="h-9 w-9 shrink-0 text-primary" /><span className="font-bold">{t('healthIntro')}</span></Link></section>}
    <FeaturedDoctors /><TrustBanner /></>);
}

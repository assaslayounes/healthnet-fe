import { Home, CalendarDays, FileText, ClipboardList, Inbox, LayoutDashboard, Users, Pill, User, ShieldCheck } from 'lucide-react';
import { useI18n, type Key } from '@/i18n';
import { useAuth } from '@/auth';
const I = { home: Home, appts: CalendarDays, docs: FileText, reqs: ClipboardList, inbox: Inbox, dash: LayoutDashboard, doctors: Users, pharm: Pill, me: User, admin: ShieldCheck };
export function useNav() {
  const { t } = useI18n(); const { user } = useAuth();
  const n = (to: string, icon: keyof typeof I, k: Key) => ({ to, Icon: I[icon], label: t(k) });
  const home = n('/', 'home', 'home'), me = n('/profile', 'me', 'profile');
  switch (user?.role) {
    case 'admin': return [home, n('/admin', 'admin', 'admin'), me];
    case 'patient': return [home, n('/appointments', 'appts', 'appointments'), n('/documents', 'docs', 'documents'), n('/requests', 'reqs', 'requests'), me];
    case 'doctor': case 'dentist': return [home, n('/dashboard', 'dash', 'dashboard'), me];
    case 'pharmacy': return [home, n('/inbox', 'inbox', 'inbox'), me];
    case 'lab': return [home, n('/dashboard', 'dash', 'dashboard'), n('/inbox', 'inbox', 'inbox'), me];
    default: return [home, n('/doctors', 'doctors', 'doctors'), n('/pharmacies', 'pharm', 'pharmacies'), me];
  }
}

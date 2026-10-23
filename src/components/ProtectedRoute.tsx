import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/auth';
import { useI18n } from '@/i18n';
import type { Role } from '@/lib/types';
export default function ProtectedRoute({ roles, children }: { roles?: Role[]; children: ReactNode }) {
  const { user, loading } = useAuth(); const { t } = useI18n(); const loc = useLocation();
  if (loading) return <p className="py-32 text-center text-muted-foreground">{t('loading')}</p>;
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { useAdminStats, useAdminUsers, useApiMutation } from '@/lib/queries';
import { useDebounced } from '@/lib/hooks';
import { useI18n, type Key } from '@/i18n';
const roles = ['patient', 'doctor', 'dentist', 'pharmacy', 'lab', 'admin'];
const statKeys = ['patients', 'doctors', 'dentists', 'pharmacies', 'labs', 'appointments', 'requests', 'documents'];
export default function Admin() {
  const { t } = useI18n(); const [q, setQ] = useState(''); const [role, setRole] = useState(''); const [confirm, setConfirm] = useState('');
  const dq = useDebounced(q); const stats = useAdminStats(); const users = useAdminUsers({ q: dq || undefined, role: role || undefined });
  const del = useApiMutation((id: number) => api.delete(`/admin/users/${id}`), [['admin'], ['providers'], ['featured']], () => toast.success(t('deleted')));
  const reset = useApiMutation(() => api.post('/admin/reset', { confirm }), [['admin'], ['providers'], ['featured']], () => { setConfirm(''); toast.success(t('resetDone')); });
  return (
    <section className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-extrabold">{t('admin')}</h1>
      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {statKeys.map((k) => <div key={k} className="rounded-2xl bg-primary-soft p-4 text-center"><p className="text-3xl font-extrabold text-primary">{stats.data?.[k] ?? '–'}</p><p className="text-sm">{t(`st_${k}` as Key)}</p></div>)}
      </div>
      <h2 className="mb-3 font-extrabold">{t('users')}</h2>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <Input placeholder={t('searchUsers')} value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={role} onChange={(e) => setRole(e.target.value)} className="h-11 rounded-lg border border-border bg-background px-3 text-sm">
          <option value="">{t('allRoles')}</option>{roles.map((r) => <option key={r} value={r}>{t(`role_${r}` as Key)}</option>)}</select>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm"><tbody>
          {users.data?.map((u) => (
            <tr key={u.id} className="border-b border-border last:border-0">
              <td className="p-3"><p className="font-bold">{u.provider_name ?? u.full_name}</p><p className="text-xs text-muted-foreground" dir="ltr">{u.email}</p></td>
              <td className="p-3"><span className="rounded-full bg-muted px-2 py-0.5 text-xs font-bold">{t(`role_${u.role}` as Key)}</span></td>
              <td className="p-3 text-end">{u.role !== 'admin' && <Button variant="ghost" size="sm" aria-label={t('deleteUser')}
                onClick={() => { if (window.confirm(`${t('confirmDelete')}\n${u.email}`)) del.mutate(u.id); }}><Trash2 className="h-4 w-4 text-red-600" /></Button>}</td>
            </tr>))}
        </tbody></table>
      </div>
      <div className="mt-10 rounded-2xl border-2 border-red-300 p-5">
        <h2 className="font-extrabold text-red-700">{t('dangerZone')}</h2>
        <p className="mb-3 text-sm text-muted-foreground">{t('resetHint')}</p>
        <div className="flex gap-2"><Input dir="ltr" placeholder="RESET" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          <Button className="bg-red-600 hover:bg-red-700" disabled={confirm !== 'RESET' || reset.isPending} onClick={() => reset.mutate(undefined)}>{t('resetDb')}</Button></div>
      </div>
    </section>
  );
}

import { keepPreviousData, useMutation, useQuery, useQueryClient, type QueryKey } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api, errKey } from './api';
import { useI18n } from '@/i18n';
import { useAuth } from '@/auth';
import type { Appointment, Notice, Provider, Review } from './types';

async function get<T>(url: string, params?: object): Promise<T> { return (await api.get<T>(url, { params })).data; }

export const useFeatured = () => useQuery({ queryKey: ['featured'], staleTime: 60_000,
  queryFn: async () => (await get<{ items: Provider[] }>('/providers/featured', { limit: 8 })).items });
export const useProviders = (params: Record<string, unknown>) => useQuery({ queryKey: ['providers', params], placeholderData: keepPreviousData,
  queryFn: async () => (await get<{ items: Provider[] }>('/providers', params)).items });
export const useProvider = (id?: string) => useQuery({ queryKey: ['provider', id], enabled: !!id, retry: false, queryFn: () => get<Provider>(`/providers/${id}`) });
export const useReviews = (id?: string) => useQuery({ queryKey: ['reviews', id], enabled: !!id,
  queryFn: async () => (await get<{ items: Review[] }>(`/providers/${id}/reviews`)).items });
export const useMyAppointments = () => useQuery({ queryKey: ['appts'], queryFn: async () => (await get<{ items: Appointment[] }>('/appointments/mine')).items });
export const useIncoming = () => useQuery({ queryKey: ['incoming'], queryFn: async () => (await get<{ items: IncomingAppt[] }>('/appointments/incoming', { limit: 50 })).items });
export const useNotices = () => useQuery({ queryKey: ['notices', 'list'], queryFn: async () => (await get<{ items: Notice[] }>('/notifications')).items });
export const useUnread = () => { const { user } = useAuth();
  return useQuery({ queryKey: ['notices', 'unread'], enabled: !!user, refetchInterval: 60_000, queryFn: async () => Number((await get<{ unread: number }>('/notifications', { limit: 1 })).unread) }); };
export const useDocs = () => useQuery({ queryKey: ['docs'], queryFn: async () => (await get<{ items: Doc[] }>('/documents', { limit: 50 })).items });
export const useRequests = () => useQuery({ queryKey: ['reqs'], queryFn: async () => (await get<{ items: ReqItem[] }>('/requests/mine')).items });
export const useRequest = (id?: string) => useQuery({ queryKey: ['req', id], enabled: !!id, refetchInterval: 8000, queryFn: () => get<ReqDetail>(`/requests/${id}`) });
export const useInbox = () => useQuery({ queryKey: ['inbox'], refetchInterval: 15_000, queryFn: async () => (await get<{ items: InboxItem[] }>('/requests/inbox')).items });
export const useInboxItem = (id?: string) => useQuery({ queryKey: ['inboxItem', id], enabled: !!id, queryFn: () => get<InboxDetailT>(`/requests/inbox/${id}`) });
export const useSchedule = (date: string, enabled = true) => useQuery({ queryKey: ['sched', date], enabled, refetchInterval: 5 * 60_000,
  queryFn: async () => (await get<{ items: Dose[] }>('/medications/schedule', { date })).items });
export const useMeds = () => useQuery({ queryKey: ['meds'], queryFn: async () => (await get<{ items: Med[] }>('/medications')).items });
export const useConditions = () => useQuery({ queryKey: ['conditions'], queryFn: async () => (await get<{ conditions: string[] }>('/health/conditions')).conditions });
export const useAdminStats = () => useQuery({ queryKey: ['admin', 'stats'], queryFn: () => get<Record<string, number | string>>('/admin/stats') });
export const useAdminUsers = (params: Record<string, unknown>) => useQuery({ queryKey: ['admin', 'users', params], placeholderData: keepPreviousData,
  queryFn: async () => (await get<{ items: AdminUser[] }>('/admin/users', params)).items });

/** طفرة موحدة: تعرض رسالة الخطأ وتُبطل ذاكرة التخزين المؤقت للمفاتيح المعطاة */
export function useApiMutation<V, R = unknown>(fn: (v: V) => Promise<R>, invalidate: QueryKey[] = [], onSuccess?: (r: R) => void) {
  const qc = useQueryClient(); const { t } = useI18n();
  return useMutation({
    mutationFn: fn,
    onSuccess: (r) => { invalidate.forEach((k) => void qc.invalidateQueries({ queryKey: k })); onSuccess?.(r); },
    onError: (e) => toast.error(t(errKey(e))),
  });
}

export interface Doc { id: number; title: string; kind: string; created_at: string }
export interface ReqItem { id: number; kind: string; priority: string; status: string; created_at: string; title: string; accepted_provider_name: string | null; targets: number; responded: number }
export interface Target { provider_id: number; name: string; phone: string | null; address: string | null; response: string; note: string | null; distance_km: string | number | null }
export interface ReqDetail { id: number; kind: string; status: string; title: string; accepted_provider_id: number | null; targets: Target[] }
export interface InboxItem { request_id: number; kind: string; priority: string; status: string; created_at: string; response: string; patient_name: string; title: string; closed_for_me: number }
export interface InboxDetailT { id: number; kind: string; status: string; priority: string; patient_name: string; title: string; response: string; url: string }
export interface IncomingAppt { id: number; scheduled_at: string; priority: string; status: string; patient_name: string }
export interface Dose { medicationId: number; name: string; dose: string | null; time: string; taken: boolean }
export interface Med { id: number; name: string; dose: string | null; times: string[] }
export interface AdminUser { id: number; role: string; full_name: string; email: string; phone: string | null; provider_name: string | null; wilaya: string | null }
